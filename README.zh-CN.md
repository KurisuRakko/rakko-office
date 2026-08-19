<p align="center">
  <img src="./public/logo.svg" width="120" height="120" alt="Office App Logo">
</p>

<h1 align="center">Rakko Office</h1>

<p align="center">
  <strong>一款现代化、本地优先的 Office 文档预览与编辑解决方案。</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/%E7%89%88%E6%9C%AC-0.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/%E6%A1%86%E6%9E%B6-Next.js%2015-black.svg" alt="Framework">
  <img src="https://img.shields.io/badge/%E8%AE%B8%E5%8F%AF%E8%AF%81-AGPL%20v3-orange.svg" alt="License">
</p>

<p align="center">
  <span>中文版</span> | <a href="README.md">English</a>
</p>

---

## 🚀 概览

**Rakko Office** 是一款强大的 Web 应用程序，旨在为您提供在浏览器中直接查看和编辑 Office 文档（Word、Excel、PowerPoint）的无缝体验。它基于“本地优先”的设计理念，在提供桌面级编辑体验的同时，确保您的文档隐私和安全。

本项目 fork 自 [baotlake/office-website](https://github.com/baotlake/office-website)，经过品牌重塑并调整为面向 Docker 自托管部署。本项目不提供任何公开在线实例——请参见下方的[部署](#-部署)章节自行运行。

## ✨ 核心特性

- **📂 多格式支持**: 支持打开和编辑 `.docx`、`.xlsx` 和 `.pptx` 文件。
- **🔒 本地优先**: 所有文件均在浏览器本地处理，确保数据隐私。
- **⚡ 快速且响应迅速**: 基于 Next.js 构建，并针对性能进行了优化。
- **🛠️ 丰富工具**: 集成了先进的编辑功能。
- **📦 持久化存储**: 使用 IndexedDB 进行本地文件管理。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **UI 组件**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **数据库**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (通过 `idb`)
- **部署**: Docker + Caddy（自托管静态导出，见下文）

## 🛠️ 快速开始

### 前提条件

- Node.js 22+
- pnpm (推荐)

### 安装步骤

1. 克隆仓库:

   ```bash
   git clone <repository-url>
   cd rakko-office
   ```

2. 安装依赖:

   ```bash
   pnpm install
   ```

3. 启动开发服务器:

   ```bash
   pnpm dev
   ```

4. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)。

## 🧩 本地开发（OnlyOffice 运行时资产）

OnlyOffice 运行时资产（`sdkjs` 引擎、`web-apps` 前端与字体）**不进入本仓库**——它们在构建/开发时从官方 `onlyoffice/documentserver` 镜像中拉取（参见 `.gitignore` 中的 `/public/v*-*/` 规则与 `.dockerignore`）。全新克隆后若缺少这些资产直接运行 `pnpm dev`，得不到可用的编辑器。

本地拉取步骤（需要 Docker）：

```bash
pnpm install
bash scripts/fetch-assets.sh   # 拉取资产到 public/v9.3.1-1/（默认 DS_VERSION=9.3.1，HASH=1）
cp .env.example .env.local     # NEXT_PUBLIC_APP_ROOT 需与上面的版本/修订号保持一致
pnpm dev
```

版本/修订号参数说明见 `scripts/fetch-assets.sh`，生产构建的等价流程见 `Dockerfile`。

## 🚢 部署

本项目没有托管型云部署——发行方式是自托管 Docker 镜像。构建产物是内置了 OnlyOffice DocumentServer 资产的 Next.js 静态导出，由 Caddy 提供服务。

```bash
./build.sh                     # 构建 office-website:latest（默认 DS_VERSION=9.3.1，HASH=1）
docker run -p 80:80 office-website:latest
```

版本/修订号参数见 `build.sh`，完整构建与服务配置见 `Dockerfile` / `Caddyfile`。构建前请设置 `NEXT_PUBLIC_SITE_URL`（见 `.env.example`）为实际访问域名，否则 canonical 链接、sitemap 与 Open Graph 元数据会指向默认值 `http://localhost:3000` 而非真实地址。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request 或开启 Issue。

## 📜 许可证

本项目采用 **GNU Affero General Public License Version 3 (AGPL v3)** 开源协议。第三方归属声明见 [NOTICE.md](./NOTICE.md)。

## 🙏 鸣谢

特别感谢以下开源项目，是它们让本项目成为可能：

- [ONLYOFFICE Web Apps](https://github.com/ONLYOFFICE/web-apps)
- [OnlyOffice x2t WASM](https://github.com/cryptpad/onlyoffice-x2t-wasm) - 浏览器内高性能文档转换。
- [ONLYOFFICE SDKJS](https://github.com/ONLYOFFICE/sdkjs)
- [Office Converters](https://github.com/cryptpad/office-converters)

---

<p align="center">
  用心打造更好的办公体验。❤️
</p>
