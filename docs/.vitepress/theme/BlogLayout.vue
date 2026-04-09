<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './ReadingProgress.vue'
import BackToTop from './BackToTop.vue'
import GiscusComment from './GiscusComment.vue'
import { useData } from 'vitepress'
import { useMediumZoom } from './composables/useMediumZoom'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

const isPost = frontmatter.value.layout !== 'page' && frontmatter.value.layout !== 'home'

useMediumZoom()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress />
    </template>
    <template #doc-after>
      <GiscusComment v-if="isPost" />
    </template>
    <template #layout-bottom>
      <BackToTop />
    </template>
  </Layout>
</template>
