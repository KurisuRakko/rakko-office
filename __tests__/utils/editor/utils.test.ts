import { describe, expect, it } from "vitest";
import { DocumentType } from "@/utils/editor/types";
import { getDocumentType, getFileExt, getNewUrl } from "@/utils/editor/utils";

describe("getFileExt", () => {
  it("正常文件名返回扩展名（小写）", () => {
    expect(getFileExt("report.docx")).toBe("docx");
  });

  it("多点文件名取最后一个点之后的部分", () => {
    expect(getFileExt("a.b.docx")).toBe("docx");
  });

  it("无扩展名时返回整个文件名的全小写", () => {
    // 实现是 name.split(".").pop() || ""：没有点时分出整个字符串，再 toLowerCase
    expect(getFileExt("README")).toBe("readme");
  });

  it("扩展名大小写不敏感，统一转为小写", () => {
    expect(getFileExt("DOC.PDF")).toBe("pdf");
  });

  it("以点开头的隐藏文件返回点后的名字", () => {
    expect(getFileExt(".gitignore")).toBe("gitignore");
  });

  it("空字符串返回空串", () => {
    expect(getFileExt("")).toBe("");
  });

  it("以点结尾的文件名返回空串", () => {
    expect(getFileExt("a.")).toBe("");
  });
});

describe("getDocumentType", () => {
  it("word 类扩展名映射为 Word", () => {
    expect(getDocumentType("docx")).toBe(DocumentType.Word);
    expect(getDocumentType("doc")).toBe(DocumentType.Word);
    expect(getDocumentType("odt")).toBe(DocumentType.Word);
    expect(getDocumentType("txt")).toBe(DocumentType.Word);
  });

  it("cell 类扩展名映射为 Cell", () => {
    expect(getDocumentType("xlsx")).toBe(DocumentType.Cell);
    expect(getDocumentType("xls")).toBe(DocumentType.Cell);
    expect(getDocumentType("csv")).toBe(DocumentType.Cell);
  });

  it("slide 类扩展名映射为 Slide", () => {
    expect(getDocumentType("pptx")).toBe(DocumentType.Slide);
    expect(getDocumentType("ppt")).toBe(DocumentType.Slide);
    expect(getDocumentType("odp")).toBe(DocumentType.Slide);
  });

  it("pdf 扩展名映射为 Pdf", () => {
    expect(getDocumentType("pdf")).toBe(DocumentType.Pdf);
  });

  it("扩展名大小写不敏感", () => {
    expect(getDocumentType("DOCX")).toBe(DocumentType.Word);
  });

  it("未知扩展名兜底为 Word", () => {
    expect(getDocumentType("exe")).toBe(DocumentType.Word);
    expect(getDocumentType("")).toBe(DocumentType.Word);
  });
});

describe("getNewUrl", () => {
  it("返回带 new 参数的编辑器地址", () => {
    expect(getNewUrl("docx")).toBe("/editor?new=docx");
    expect(getNewUrl("xlsx")).toBe("/editor?new=xlsx");
  });
});
