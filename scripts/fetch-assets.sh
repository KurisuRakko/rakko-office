#!/usr/bin/env bash
# fetch-assets.sh —— 为本地开发拉取 OnlyOffice DocumentServer 运行时资产
#
# sdkjs 引擎、web-apps 前端与字体体积大且随 OnlyOffice 版本频繁更新，因此不进入
# git 仓库（见 .gitignore 中的 /public/v*-*/ 规则），只在生产构建（Dockerfile
# 第一/三阶段）或本地开发（本脚本）时从官方镜像现拷贝一份。脚本行为与 Dockerfile
# 保持一致，只是把「构建期 COPY --from」换成「运行期 docker cp」：
#   1) 启动一个常驻的官方 DocumentServer 容器
#   2) 在容器内生成 AllFonts.js / themes.js（镜像里默认没有，需运行时生成）
#   3) 把 fonts / sdkjs / web-apps / sdkjs-plugins 拷到 public/v<版本>-<修订号>/
#   4) 由 api.js.tpl 复制出 api.js（完整部署中这一步在运行时由模板引擎完成）
#
# 用法:
#   bash scripts/fetch-assets.sh [DS_VERSION] [HASH]
#
# 示例:
#   bash scripts/fetch-assets.sh            # 默认 DS_VERSION=9.3.1 HASH=1
#   bash scripts/fetch-assets.sh 9.3.1 2    # 更换修订号（用于清缓存/对比）
#   bash scripts/fetch-assets.sh 9.3.0 1    # 切换 DocumentServer 版本
#
# 与 build.sh 的 CLI 形状保持一致，两者共用同一套版本/修订号语义。

set -euo pipefail

DS_VERSION="${1:-9.3.1}"
HASH="${2:-1}"

CONTAINER_NAME="rakko-ds-tmp"

# 脚本可能从任意工作目录被调用，用脚本自身路径推导仓库根目录，
# 保证资产始终落到正确的 public/ 下。
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_DIR="${REPO_ROOT}/public/v${DS_VERSION}-${HASH}"

# ---------- 前置检查：docker 是否可用 ----------

if ! command -v docker >/dev/null 2>&1; then
  echo "✗ 未找到 docker 命令，请先安装 Docker（Docker Desktop 或等价环境）后重试。" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "✗ 无法连接 Docker daemon：请确认 Docker 已启动，且当前用户有权限访问。" >&2
  exit 1
fi

echo "→ DocumentServer 版本 : ${DS_VERSION}"
echo "→ 修订号              : ${HASH}"
echo "→ 目标目录            : public/v${DS_VERSION}-${HASH}"

# ---------- 清理兜底 ----------
# 用 trap 保证脚本在任意步骤中途失败（拉镜像失败、磁盘满等）时都不留下僵尸容器，
# 无论脚本是正常结束还是提前 exit，EXIT trap 都会执行。
cleanup() {
  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# 启动前先清理可能残留的同名容器（例如上一次运行异常退出、trap 未及时生效）。
cleanup

# ---------- 目标目录处理 ----------

if [ -d "${TARGET_DIR}" ]; then
  echo "⚠ 目标目录已存在，将先删除以避免新旧版本资产混杂：${TARGET_DIR}"
  # 上一次拉取的资产里可能含有只读目录（见下方 tar 方案的说明），
  # 先递归加上属主写权限，否则 rm -rf 会在只读子目录上失败。
  chmod -R u+w "${TARGET_DIR}" 2>/dev/null || true
  rm -rf "${TARGET_DIR}"
fi
mkdir -p "${TARGET_DIR}"

# ---------- 拉取资产 ----------

echo "→ 启动常驻临时容器（字体生成与后续拷贝需发生在同一容器文件系统状态上，故不用 --rm 的一次性容器）..."
docker run -d --name "${CONTAINER_NAME}" "onlyoffice/documentserver:${DS_VERSION}" tail -f /dev/null >/dev/null

echo "→ 生成 AllFonts.js / themes.js（镜像里默认没有，需运行时生成）..."
docker exec "${CONTAINER_NAME}" documentserver-generate-allfonts.sh false

# docker cp 不支持花括号展开，四个目录必须分开拷贝。
#
# 注意：这里没有直接用 `docker cp SRC DEST`，而是让 docker cp 把 tar 流输出到
# stdout 再用本地 GNU tar 解包（`docker cp SRC - | tar -xf - -C DEST`）。
# 原因：官方镜像里 fonts 等目录权限是 555（只读）。dockerd 内置的 cp 实现会
# 逐条按 tar 头权限建路径，导致目录一建好就是只读，随即写入其子文件时
# permission denied；GNU tar 会推迟到写完目录内容后才回填最终权限，
# 不会有这个问题。docker cp 输出的 tar 顶层条目就是源目录本名（如 `fonts/`），
# 所以解包目标目录写 TARGET_DIR 本身即可，得到的路径与直接 cp 完全一致。
echo "→ 拷贝 fonts ..."
docker cp "${CONTAINER_NAME}:/var/www/onlyoffice/documentserver/fonts" - | tar -xf - -C "${TARGET_DIR}"

echo "→ 拷贝 sdkjs ..."
docker cp "${CONTAINER_NAME}:/var/www/onlyoffice/documentserver/sdkjs" - | tar -xf - -C "${TARGET_DIR}"

echo "→ 拷贝 web-apps ..."
docker cp "${CONTAINER_NAME}:/var/www/onlyoffice/documentserver/web-apps" - | tar -xf - -C "${TARGET_DIR}"

echo "→ 拷贝 sdkjs-plugins ..."
docker cp "${CONTAINER_NAME}:/var/www/onlyoffice/documentserver/sdkjs-plugins" - | tar -xf - -C "${TARGET_DIR}"

echo "→ 生成 api.js（复制自 api.js.tpl，完整部署中这一步由运行时模板引擎完成）..."
# 实测发现这一步会连续踩两层只读权限，缺一个都会 permission denied：
#   1. documentserver-generate-allfonts.sh 会连带重启 docservice/converter 等
#      服务，这些服务启动时自己用容器内部的 hash 把 api.js.tpl 渲染成一份 api.js，
#      随上面 docker cp web-apps 一并带了过来——但它所在的 documents 目录权限是
#      555（只读，与源镜像里 web-apps/apps/api 同一脉的权限一致），没有写权限
#      无法在其中删除/新建文件，必须先 chmod u+w 这一层目录本身。
#   2. 那份被带过来的 api.js 文件本身也是 444（只读），即使目录可写，普通 cp
#      仍会因为无法以写方式打开已存在的目标文件而失败，需要 -f（打不开就先
#      删除再重建）才能覆盖。
# 而且那份自动生成的 api.js 里的 hash 是容器内部生成的，和我们目录名里的
# ${HASH} 无关，与 Dockerfile 第三阶段「直接从模板生成」的做法不一致，所以
# 这里始终用未替换占位符的原始模板覆盖它，以保持与 Dockerfile 行为一致。
chmod u+w "${TARGET_DIR}/web-apps/apps/api/documents"
cp -f "${TARGET_DIR}/web-apps/apps/api/documents/api.js.tpl" \
      "${TARGET_DIR}/web-apps/apps/api/documents/api.js"

echo ""
echo "✓ 资产拉取完成：public/v${DS_VERSION}-${HASH}"
echo ""
echo "  接下来："
echo "    1. 在 .env.local 中写入 NEXT_PUBLIC_APP_ROOT=/v${DS_VERSION}-${HASH}"
echo "    2. 运行 pnpm dev"
