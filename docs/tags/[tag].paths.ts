import { allTags } from '../.vitepress/taxonomy'

/** 标签动态路由的参数来源（同为纯词表，理由见 [series].paths.ts） */
export default {
  paths() {
    return allTags().map((tag) => ({ params: { tag: tag.slug } }))
  },
}
