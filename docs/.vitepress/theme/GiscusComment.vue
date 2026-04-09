<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div class="giscus-wrapper">
    <Giscus
      id="comments"
      repo="Rivhome/Rivhome.github.io"
      repo-id="YR_kgDOQbLeQw"
      category="Announcements"
      category-id="DIC_kwDOQbLeQ84C6bXC"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
