import { describe, expect, it } from "vitest";
import {
  isRTL,
  languages,
  locales,
  Locale,
  LocaleExtend,
  rtlLanguages,
  standardizeLocale,
} from "@/lib/locale";

describe("standardizeLocale", () => {
  it("标准 zh-CN 原样返回", () => {
    expect(standardizeLocale("zh-CN")).toBe(Locale.ZH_CN);
  });

  it("下划线写法转为连字符", () => {
    expect(standardizeLocale("zh_TW")).toBe(Locale.ZH_TW);
    expect(standardizeLocale("pt_BR")).toBe(Locale.PT_BR);
  });

  it("en-US / en-GB / en-AU 归一为 en", () => {
    expect(standardizeLocale("en-US")).toBe(Locale.EN);
    expect(standardizeLocale("en-GB")).toBe(Locale.EN);
    expect(standardizeLocale("en-AU")).toBe(Locale.EN);
  });

  it("带地区后缀且不在白名单时按主语言前缀匹配", () => {
    expect(standardizeLocale("fr-CA")).toBe(Locale.FR);
    // zh 前缀按 locales 顺序第一个命中的是 zh-CN
    expect(standardizeLocale("zh-HK")).toBe(Locale.ZH_CN);
    // pt-BR 本身就在 locales 里，直接命中
    expect(standardizeLocale("pt-BR")).toBe(Locale.PT_BR);
  });

  it("全小写的 zh-cn 按前缀匹配到 zh-CN", () => {
    expect(standardizeLocale("zh-cn")).toBe(Locale.ZH_CN);
  });

  it("未知输入兜底为 en", () => {
    expect(standardizeLocale("xx-YY")).toBe(Locale.EN);
    expect(standardizeLocale("zz")).toBe(Locale.EN);
  });

  it("空字符串兜底为 en（前缀空串匹配到第一个 locale）", () => {
    // 实现中空串 split 出空主语言，startsWith("") 恒真，命中最靠前的 en
    expect(standardizeLocale("")).toBe(Locale.EN);
  });

  it("大小写混写但语言代码大写时兜底为 en（实现不区分大小写前的已知行为）", () => {
    // 实现是先做大小写敏感的 includes 与前缀匹配，全部小写后才可能命中；
    // "ZH-CN" 的主语言 "ZH" 匹配不到任何全小写 locale，最终走 en 兜底。
    expect(standardizeLocale("ZH-CN")).toBe(Locale.EN);
  });
});

describe("isRTL", () => {
  it("对 rtlLanguages 中的语言返回 true", () => {
    expect(isRTL(Locale.AR)).toBe(true);
    expect(isRTL(Locale.FA)).toBe(true);
    expect(isRTL(Locale.HE)).toBe(true);
  });

  it("其余语言返回 false", () => {
    expect(isRTL(Locale.EN)).toBe(false);
    expect(isRTL(Locale.ZH_CN)).toBe(false);
    expect(isRTL(Locale.JA)).toBe(false);
    expect(isRTL(LocaleExtend.Auto)).toBe(false);
  });
});

describe("导出集合的基本不变量", () => {
  it("locales 非空且无重复", () => {
    expect(locales.length).toBeGreaterThan(0);
    expect(new Set(locales).size).toBe(locales.length);
  });

  it("rtlLanguages 非空、无重复且全部属于 locales", () => {
    expect(rtlLanguages.length).toBeGreaterThan(0);
    expect(new Set(rtlLanguages).size).toBe(rtlLanguages.length);
    for (const lang of rtlLanguages) {
      expect(locales).toContain(lang);
    }
  });

  it("languages 是 locales 的超集（多一个 auto）", () => {
    for (const l of locales) {
      expect(languages).toContain(l);
    }
    expect(languages).toContain("auto");
    expect(languages.length).toBe(locales.length + 1);
  });
});
