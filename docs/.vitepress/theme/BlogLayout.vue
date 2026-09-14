<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import ReadingProgress from './ReadingProgress.vue'
import BackToTop from './BackToTop.vue'
import GiscusComment from './GiscusComment.vue'
import PostMeta from './components/PostMeta.vue'
import PostNeighbors from './components/PostNeighbors.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomePage from './HomePage.vue'
import { useMediumZoom } from './composables/useMediumZoom'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

const isPost = computed(() => {
  // Blog posts have a 'date' field in frontmatter; nav pages (archives, tags, etc.) do not
  const fm = frontmatter.value
  return fm.layout !== 'home' && !!fm.date
})

const isHome = computed(() => {
  const layout = frontmatter.value.layout
  return layout === 'home'
})

useMediumZoom()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress v-if="isPost" />
    </template>

    <template v-if="isHome" #home-features-before>
      <HomePage />
    </template>

    <!-- 文章头部（标题 + 日期/字数/阅读时长/分类/标签），在内容列内渲染 -->
    <template v-if="isPost" #doc-before>
      <PostMeta />
    </template>

    <template #doc-after>
      <template v-if="isPost">
        <PostNeighbors />
        <GiscusComment />
      </template>
    </template>

    <template #layout-bottom>
      <SiteFooter />
      <BackToTop />
    </template>
  </Layout>
</template>
