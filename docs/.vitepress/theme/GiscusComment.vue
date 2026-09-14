<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div class="giscus-wrapper">
    <!-- 主题名必须是 giscus 官方列表里的名字（styles/themes/），
         写错会导致 giscus 行为未定义（浅色模式下渲染异常）。
         light: noborder_light / dark: transparent_dark -->
    <Giscus
      id="comments"
      repo="Rivhome/Rivhome.github.io"
      repo-id="R_kgDOQbLeQw"
      category="Announcements"
      category-id="DIC_kwDOQbLeQ84C6bXC"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="isDark ? 'transparent_dark' : 'noborder_light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 4rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--bl-divider);
}
</style>
