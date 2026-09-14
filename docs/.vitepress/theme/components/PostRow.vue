<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../utils/format-date'

const props = defineProps<{
  url: string
  title: string
  /** 数据加载器产物经序列化后到达客户端时是 ISO 字符串 */
  date: Date | string
  /** true 时只显示 MM-DD（用于按年分组的归档，年份已由分组标题表达） */
  short?: boolean
}>()

const label = computed(() => formatDate(props.date, !props.short))

const datetime = computed(() => {
  const d = new Date(props.date)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
})
</script>

<template>
  <li class="post-row">
    <time :datetime="datetime">{{ label }}</time>
    <a :href="url">{{ title }}</a>
  </li>
</template>

<style scoped>
.post-row {
  display: flex;
  align-items: baseline;
  gap: var(--bl-space-4);
  padding: 10px 0;
  border-bottom: 1px solid var(--bl-divider);
}

.post-row:last-child {
  border-bottom: none;
}

time {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-size: var(--bl-text-body);
  line-height: 1.6;
  transition: color 0.2s;
}

a:hover {
  color: var(--bl-accent);
}
</style>
