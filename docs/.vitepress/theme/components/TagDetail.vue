<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'
import { slugForTag, tagBySlug } from '../../taxonomy'
import PostList from './PostList.vue'

const props = defineProps<{
  /** 由动态路由参数传入（/tags/<slug>） */
  slug: string
}>()

const tag = computed(() => tagBySlug(props.slug))

const matched = computed(() =>
  posts.filter((post) => post.tags.some((name) => slugForTag(name) === props.slug)),
)
</script>

<template>
  <div v-if="tag">
    <header class="tag-header">
      <h1 class="tag-title">#{{ tag.name }}</h1>
      <p v-if="tag.description" class="tag-description">{{ tag.description }}</p>
      <p class="tag-meta">共 {{ matched.length }} 篇文章</p>
    </header>

    <PostList v-if="matched.length > 0" class="tag-posts" :posts="matched" />
    <p v-else class="blog-empty">这个标签下暂时还没有文章。</p>

    <p class="back-link"><a href="/tags/">← 全部标签</a></p>
  </div>

  <div v-else>
    <div class="blog-empty">
      <p>没有找到这个标签，可能链接已经过期。</p>
      <p><a href="/tags">查看全部标签</a></p>
    </div>
  </div>
</template>

<style scoped>
.tag-title {
  font-size: var(--bl-text-h1);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: var(--bl-tracking-tight);
  margin: 0;
  color: var(--bl-text-1);
}

.tag-description {
  margin: var(--bl-space-3) 0 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--bl-text-2);
}

.tag-meta {
  margin: var(--bl-space-3) 0 0;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
}

.tag-posts {
  margin-top: var(--bl-space-8);
}

.back-link {
  margin-top: var(--bl-space-8);
  font-size: var(--bl-text-small);
}

.back-link a {
  color: var(--bl-text-3);
  text-decoration: none;
}

.back-link a:hover {
  color: var(--bl-accent);
}
</style>
