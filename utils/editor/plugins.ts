// 第一阶段不接入插件市场（原实现依赖上游项目作者个人维护的 CDN）。
// 保留此函数仅为让调用方（server.ts 的 /plugins.json 处理）拿到统一的空结构。
export function getPluginsData() {
  return {
    url: "",
    pluginsData: [],
    autostart: [],
  };
}
