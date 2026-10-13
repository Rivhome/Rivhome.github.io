import { allSeries } from '../.vitepress/taxonomy'

/**
 * 合集动态路由的参数来源。
 *
 * 只依赖纯词表模块：本文件在 VitePress 完成配置解析之前执行，
 * 此时不能调用 createContentLoader（会抛「content loader invoked without
 * an active vitepress process」）。
 */
export default {
  paths() {
    return allSeries().map((series) => ({ params: { series: series.slug } }))
  },
}
