<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { formatDate } from '../../lib/date'
import type { PostPageMeta } from '../../lib/types'
import TagChips from './TagChips.vue'
import StaleNotice from './StaleNotice.vue'
import Revisions from './Revisions.vue'

const { frontmatter } = useData()

// 构建期由 config.ts 的 transformPageData 注入（见 lib/seo.ts / lib/posts.ts）
const meta = computed(() => frontmatter.value.post as PostPageMeta | undefined)
const updatedLabel = computed(() =>
  meta.value?.updated ? formatDate(meta.value.updated) : '',
)
</script>

<template>
  <header v-if="meta" class="post-header">
    <img v-if="meta.cover" class="post-cover" :src="meta.cover" :alt="meta.title" />

    <h1 class="post-title">{{ meta.title }}</h1>

    <div class="post-meta">
      <time>{{ formatDate(meta.date) }}</time>
      <template v-if="meta.wordCount > 0">
        <span class="sep">·</span>
        <span>{{ meta.wordCount.toLocaleString('zh-CN') }} 字</span>
        <span class="sep">·</span>
        <span>{{ meta.readingTime }} 分钟</span>
      </template>
      <template v-if="updatedLabel">
        <span class="sep">·</span>
        <span>更新于 {{ updatedLabel }}</span>
      </template>
    </div>

    <p v-if="meta.series" class="post-series">
      <a class="series-badge" :href="`/series/${meta.series.slug}`">
        合集《{{ meta.series.name }}》第 {{ meta.series.index }}/{{ meta.series.total }} 篇
      </a>
    </p>
    <p v-else-if="meta.undeclaredSeries" class="post-series">
      <span class="series-badge undeclared">
        合集《{{ meta.undeclaredSeries }}》（未在词表中声明，暂无合集页）
      </span>
    </p>

    <TagChips v-if="meta.tags.length > 0" class="post-tags" :tags="meta.tags" />

    <StaleNotice
      v-if="meta.staleDays"
      :days="meta.staleDays"
      :date="updatedLabel || formatDate(meta.date)"
    />

    <Revisions v-if="meta.revisions.length > 0" :revisions="meta.revisions" />
  </header>
</template>

<style scoped>
.post-header {
  margin-bottom: var(--bl-space-8);
}

.post-cover {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: var(--bl-space-6);
}

/* PostHeader 渲染在 .vp-doc 之外，标题样式在此自足 */
.post-title {
  font-size: var(--bl-text-h1);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: var(--bl-tracking-tight);
  margin: 0 0 var(--bl-space-4);
  color: var(--bl-text-1);
}

.post-meta {
  font-size: var(--bl-text-meta);
  line-height: 1.5;
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.5em;
  row-gap: 0.25em;
  margin: 0;
}

.sep {
  opacity: 0.7;
}

.post-series {
  margin: var(--bl-space-4) 0 0;
}

.series-badge {
  display: inline-block;
  font-size: var(--bl-text-small);
  color: var(--bl-accent);
  text-decoration: none;
  border-bottom: 1px solid var(--bl-brand-200);
  padding-bottom: 1px;
}

.series-badge:hover {
  border-bottom-color: var(--bl-accent);
}

.series-badge.undeclared {
  color: var(--bl-text-3);
  border-bottom-color: transparent;
}

.post-tags {
  margin-top: var(--bl-space-4);
}
</style>
