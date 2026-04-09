import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'
import BlogLayout from './BlogLayout.vue'
import PostList from './PostList.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: BlogLayout,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
  },
} satisfies Theme
