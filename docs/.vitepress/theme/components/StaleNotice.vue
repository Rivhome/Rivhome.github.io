<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** 距最后更新的天数 */
  days: number
  /** 最后更新日期（YYYY-MM-DD） */
  date: string
}>()

const ageLabel = computed(() => {
  if (props.days >= 365) {
    const years = Math.floor(props.days / 365)
    return `${years} 年多`
  }
  return `${Math.max(1, Math.round(props.days / 30))} 个多月`
})
</script>

<template>
  <p class="stale-notice">
    这篇文章最后更新于 {{ date }}（{{ ageLabel }}前），部分内容可能已经过时，请留意时效性。
  </p>
</template>

<style scoped>
.stale-notice {
  margin: var(--bl-space-4) 0 0;
  padding: var(--bl-space-3) var(--bl-space-4);
  border-left: 2px solid var(--bl-warning);
  background: var(--bl-warn-bg);
  font-size: var(--bl-text-meta);
  line-height: 1.7;
  color: var(--bl-text-2);
}
</style>
