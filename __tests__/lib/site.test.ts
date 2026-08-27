import { afterEach, describe, expect, it, vi } from "vitest";

// SITE_URL 是模块级常量，读取 process.env.NEXT_PUBLIC_SITE_URL；
// 测环境变量分支必须用 vi.resetModules() + 动态 import() 重新求值模块，
// 不能靠改运行时变量（模块加载后常量已固定）。
describe("lib/site 的 SITE_URL", () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    vi.resetModules();
    if (ORIGINAL === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
    }
  });

  it("未设置环境变量时兜底为 http://localhost:3000", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();
    const { SITE_URL } = await import("@/lib/site");
    expect(SITE_URL).toBe("http://localhost:3000");
  });

  it("设置了 NEXT_PUBLIC_SITE_URL 时使用该值", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://office.example.com";
    vi.resetModules();
    const { SITE_URL } = await import("@/lib/site");
    expect(SITE_URL).toBe("https://office.example.com");
  });
});
