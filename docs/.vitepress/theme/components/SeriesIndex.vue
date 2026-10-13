<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'
import { buildSeries } from '../../lib/series'
import SeriesCard from './SeriesCard.vue'

const list = computed(() => buildSeries(posts))
</script>

<template>
  <div>
    <div v-if="list.length === 0" class="blog-empty">
      <p>还没有合集。</p>
      <p>在文章的 front matter 里加上 <code>series: 合集名</code> 与 <code>seriesOrder: 1</code>，
      并在 <code>docs/.vitepress/taxonomy.ts</code> 里声明这个合集即可。</p>
    </div>

    <div v-else class="series-list">
      <SeriesCard v-for="series in list" :key="series.slug" :series="series" />
    </div>
  </div>
</template>
