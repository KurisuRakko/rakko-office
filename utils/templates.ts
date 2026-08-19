export interface Template {
  name: string;
  filename: string;
  preview: string;
  type: "pptx" | "docx" | "xlsx";
  category: string;
}

// 演示模板清单：public/files/ 下原有的 pptx/docx/xlsx 样例与预览图
// 来源不明、版权风险不可接受，已整体清空。模板画廊功能本身保留，
// 呈现空列表；后续若要重新上架模板，在此补充清单并放回对应文件即可。
const templatesData: Template[] = [];

export function getTemplates(): Template[] {
  return templatesData;
}

export function getRecommendedTemplates(count = 4): Template[] {
  return getTemplates().slice(0, count);
}

export function getCategories(): string[] {
  return Array.from(new Set(getTemplates().map((t) => t.category)));
}
