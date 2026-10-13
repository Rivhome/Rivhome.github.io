<script setup lang="ts">
import type { Revision } from '../../lib/types'

defineProps<{
  revisions: Revision[]
}>()
</script>

<template>
  <details class="revisions">
    <summary>修订记录（{{ revisions.length }} 次）</summary>
    <ul>
      <li v-for="revision in revisions" :key="`${revision.date}-${revision.note}`">
        <time>{{ revision.date }}</time>
        <span>{{ revision.note }}</span>
      </li>
    </ul>
  </details>
</template>

<style scoped>
.revisions {
  margin-top: var(--bl-space-4);
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
}

.revisions summary {
  cursor: pointer;
  color: var(--bl-text-3);
  font-size: var(--bl-text-meta);
  list-style: none;
}

.revisions summary::before {
  content: '▸ ';
}

.revisions[open] summary::before {
  content: '▾ ';
}

.revisions ul {
  list-style: none;
  margin: var(--bl-space-2) 0 0;
  padding: 0 0 0 var(--bl-space-4);
  border-left: 1px solid var(--bl-divider);
}

.revisions li {
  display: flex;
  align-items: baseline;
  gap: var(--bl-space-3);
  padding: 3px 0;
}

.revisions time {
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  font-size: var(--bl-text-meta);
}
</style>
