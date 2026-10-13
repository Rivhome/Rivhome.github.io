<script setup lang="ts">
import { SITE } from '../../site'
</script>

<template>
  <section class="greeting">
    <h1 class="greeting-title">你好，我是 {{ SITE.author }}。</h1>
    <p class="greeting-bio">{{ SITE.description }}</p>
  </section>
</template>

<style scoped>
.greeting {
  margin-bottom: var(--bl-space-14);
}

.greeting-title {
  font-size: var(--bl-text-display);
  font-weight: 700;
  letter-spacing: var(--bl-tracking-tight);
  line-height: 1.3;
  margin: 0;
  color: var(--bl-text-1);
}

.greeting-bio {
  margin: var(--bl-space-3) 0 0;
  font-size: 0.9375rem;
  color: var(--bl-text-2);
}

@media (max-width: 768px) {
  .greeting-title {
    font-size: 1.75rem;
  }
}
</style>
