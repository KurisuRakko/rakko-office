import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // OnlyOffice 运行时资产（sdkjs/web-apps 等）由 scripts/fetch-assets.sh 或
    // Docker 构建期拉取到本地，体积巨大且含大量非本项目源码的第三方压缩产物；
    // 纳入 lint 扫描范围会因巨型 minified 文件导致 ESLint 内存耗尽崩溃，
    // 且这些文件本就不受本项目代码规范约束，故与 .gitignore/.dockerignore
    // 保持一致地整体排除。
    "public/v*-*/**",
  ]),
]);

export default eslintConfig;
