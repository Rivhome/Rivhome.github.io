<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import ReadingProgress from './ReadingProgress.vue'
import BackToTop from './BackToTop.vue'
import GiscusComment from './GiscusComment.vue'
import PostHeader from './components/PostHeader.vue'
import PostNav from './components/PostNav.vue'
import SeriesNav from './components/SeriesNav.vue'
import RelatedPosts from './components/RelatedPosts.vue'
import NotFound from './components/NotFound.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useMediumZoom } from './composables/useMediumZoom'
import type { PostPageMeta } from '../lib/types'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// 文章页的元信息由 config.ts 的 transformPageData 静态注入，
// 因此本组件不需要 import 整份 posts 索引（见 lib/types.ts 的 PostPageMeta）
const post = computed(() => frontmatter.value.post as PostPageMeta | undefined)
const isPost = computed(() => Boolean(post.value))

useMediumZoom()
</script>

<template>
  <Layout>
    <!-- 未知路径由主题的 not-found 插槽渲染（见 components/NotFound.vue） -->
    <template #not-found>
      <NotFound />
    </template>

    <template #layout-top>
      <ReadingProgress v-if="isPost" />
    </template>

    <template v-if="isPost" #doc-before>
      <PostHeader />
    </template>

    <template v-if="isPost" #doc-after>
      <!-- 属于合集时给合集内导航，否则给全站相邻文章 -->
      <SeriesNav v-if="post?.series" :series="post.series" />
      <PostNav v-else :newer="post?.prev" :older="post?.next" />
      <RelatedPosts :items="post?.related ?? []" />
      <GiscusComment />
    </template>

    <template #layout-bottom>
      <SiteFooter />
      <BackToTop />
    </template>
  </Layout>
</template>
