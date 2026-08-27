import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatFileSize, formatRelativeTime } from "@/utils/recent-files";

const KB = 1024;
const MB = 1024 * 1024;
const GB = 1024 * 1024 * 1024;

describe("formatFileSize", () => {
  it("0 字节显示为 0 B", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("字节级数值", () => {
    expect(formatFileSize(1)).toBe("1 B");
    expect(formatFileSize(1023)).toBe("1023 B");
  });

  it("KB 边界与小数", () => {
    expect(formatFileSize(KB)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2048)).toBe("2 KB");
  });

  it("MB 边界与小数", () => {
    expect(formatFileSize(MB)).toBe("1 MB");
    expect(formatFileSize(2.5 * MB)).toBe("2.5 MB");
  });

  it("GB 边界与极大值", () => {
    expect(formatFileSize(GB)).toBe("1 GB");
    expect(formatFileSize(3 * GB)).toBe("3 GB");
    expect(formatFileSize(128 * GB)).toBe("128 GB");
  });
});

// formatRelativeTime 依赖 Date.now()，用假时钟固定当前时间，避免随时间漂移
const NOW = new Date("2026-01-01T00:00:00Z").getTime();
const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 7 * DAY;

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("时间戳为 0 显示 Unknown", () => {
    expect(formatRelativeTime(0)).toBe("Unknown");
  });

  it("一分钟内显示 Just now（含未来时间戳的负差值）", () => {
    expect(formatRelativeTime(NOW - 30_000)).toBe("Just now");
    expect(formatRelativeTime(NOW - 59_999)).toBe("Just now");
    expect(formatRelativeTime(NOW + 60_000)).toBe("Just now");
  });

  it("分钟档显示 N minute(s) ago（含单复数）", () => {
    expect(formatRelativeTime(NOW - MINUTE)).toBe("1 minute ago");
    expect(formatRelativeTime(NOW - 5 * MINUTE)).toBe("5 minutes ago");
    expect(formatRelativeTime(NOW - 59 * MINUTE)).toBe("59 minutes ago");
  });

  it("小时档显示 N hour(s) ago", () => {
    expect(formatRelativeTime(NOW - HOUR)).toBe("1 hour ago");
    expect(formatRelativeTime(NOW - 23 * HOUR)).toBe("23 hours ago");
  });

  it("天档显示 N day(s) ago", () => {
    expect(formatRelativeTime(NOW - DAY)).toBe("1 day ago");
    expect(formatRelativeTime(NOW - 6 * DAY)).toBe("6 days ago");
  });

  it("周档显示 N week(s) ago", () => {
    expect(formatRelativeTime(NOW - WEEK)).toBe("1 week ago");
    expect(formatRelativeTime(NOW - 3 * WEEK)).toBe("3 weeks ago");
  });

  it("四周及以上显示本地化日期", () => {
    // 断言用同一个 toLocaleDateString 计算期望值，避免时区差异导致脆弱
    const ts = NOW - 4 * WEEK;
    expect(formatRelativeTime(ts)).toBe(new Date(ts).toLocaleDateString());
  });
});
