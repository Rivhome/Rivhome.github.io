<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './ReadingProgress.vue'
import BackToTop from './BackToTop.vue'
import GiscusComment from './GiscusComment.vue'
import HomePage from './HomePage.vue'
import { useData } from 'vitepress'
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
      <ReadingProgress />
    </template>

    <template v-if="isHome" #home-features-before>
      <HomePage />
    </template>

    <template #doc-after>
      <GiscusComment v-if="isPost" />
    </template>
    <template #layout-bottom>
      <BackToTop />
    </template>
  </Layout>
</template>
