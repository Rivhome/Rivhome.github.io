import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'
import BlogLayout from './BlogLayout.vue'
import HomePage from './HomePage.vue'
import PostList from './PostList.vue'
import ProfileCard from './components/ProfileCard.vue'
import TagCloud from './components/TagCloud.vue'
import CategoryList from './components/CategoryList.vue'
import StatsCalendar from './components/StatsCalendar.vue'
import ChangelogList from './components/ChangelogList.vue'
import Pagination from './components/Pagination.vue'
import AboutPage from './AboutPage.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: BlogLayout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('PostList', PostList)
    app.component('ProfileCard', ProfileCard)
    app.component('TagCloud', TagCloud)
    app.component('CategoryList', CategoryList)
    app.component('StatsCalendar', StatsCalendar)
    app.component('ChangelogList', ChangelogList)
    app.component('Pagination', Pagination)
    app.component('AboutPage', AboutPage)
  },
} satisfies Theme
