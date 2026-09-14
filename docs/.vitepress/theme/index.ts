import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'

// 自托管变量字体（family 名：Inter Variable / JetBrains Mono Variable）
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'

import BlogLayout from './BlogLayout.vue'
import HomePage from './HomePage.vue'
import PostList from './PostList.vue'
import TagCloud from './components/TagCloud.vue'
import CategoryList from './components/CategoryList.vue'
import StatsCalendar from './components/StatsCalendar.vue'
import ChangelogList from './components/ChangelogList.vue'
import PostRow from './components/PostRow.vue'
import AboutPage from './AboutPage.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: BlogLayout,
  enhanceApp({ app }) {
    // 以下组件在 .md 页面模板中直接使用，需全局注册
    app.component('HomePage', HomePage)
    app.component('PostList', PostList)
    app.component('PostRow', PostRow)
    app.component('TagCloud', TagCloud)
    app.component('CategoryList', CategoryList)
    app.component('StatsCalendar', StatsCalendar)
    app.component('ChangelogList', ChangelogList)
    app.component('AboutPage', AboutPage)
  },
} satisfies Theme
