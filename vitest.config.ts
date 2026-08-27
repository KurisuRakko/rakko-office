import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// 路径别名 @ 与 tsconfig.json 的 paths（"@/*": ["./*"]）保持一致，均指向仓库根目录。
// 默认使用 node 环境；目前所有被测函数都是纯函数，不依赖浏览器 API，
// 未来若某个被测模块确实依赖 DOM，再为该文件单独切换 environment。
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
  },
});
