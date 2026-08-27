import { describe, expect, it } from "vitest";
import { FileText } from "lucide-react";
import { getDocConfig } from "@/lib/document-types";

describe("getDocConfig", () => {
  it("已知类型返回对应配置", () => {
    const docx = getDocConfig("docx");
    expect(docx.type).toBe("docx");
    expect(docx.color).toContain("blue");
    expect(docx.bgColor).toContain("blue");

    const xlsx = getDocConfig("xlsx");
    expect(xlsx.type).toBe("xlsx");
    expect(xlsx.color).toContain("green");

    const pptx = getDocConfig("pptx");
    expect(pptx.type).toBe("pptx");
    expect(pptx.color).toContain("orange");

    const pdf = getDocConfig("pdf");
    expect(pdf.type).toBe("pdf");
    expect(pdf.color).toContain("red");
  });

  it("类型名大小写不敏感", () => {
    expect(getDocConfig("DOCX").type).toBe("docx");
    expect(getDocConfig("Xlsx").type).toBe("xlsx");
  });

  it("带前导点的输入会被去掉点后命中", () => {
    // 实现是 type.toLowerCase().replace(".", "")，只替换第一个点
    expect(getDocConfig(".docx").type).toBe("docx");
  });

  it("未知类型走 fallback 分支", () => {
    const cfg = getDocConfig("exe");
    expect(cfg.type).toBe("unknown");
    expect(cfg.icon).toBe(FileText);
    expect(cfg.color).toBe("text-primary");
    expect(cfg.bgColor).toBe("bg-primary/5");
  });

  it("空字符串也走 fallback 分支", () => {
    expect(getDocConfig("").type).toBe("unknown");
  });
});
