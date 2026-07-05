<script setup lang="ts">
import { data as stats } from '../../stats.data'

const avatarUrl = '/images/my-avatar.jpg'
const nickname = 'Rivhome'
const bio = 'changing world, one line of code at a time'
const location = 'Earth'
</script>

<template>
  <div class="profile-card">
    <div class="profile-avatar">
      <img :src="avatarUrl" :alt="nickname" />
    </div>
    <div class="profile-info">
      <h2 class="profile-name">{{ nickname }}</h2>
      <p class="profile-bio">{{ bio }}</p>
      <p v-if="location" class="profile-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {{ location }}
      </p>
    </div>
    <div class="profile-stats">
      <div class="stat-item">
        <span class="stat-num">{{ stats.totalPosts }}</span>
        <span class="stat-label">文章</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.totalTags }}</span>
        <span class="stat-label">标签</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.totalCategories }}</span>
        <span class="stat-label">分类</span>
      </div>
    </div>
    <div class="profile-social">
      <a href="https://github.com/Rivhome" target="_blank" rel="noopener" title="GitHub" class="social-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <a href="mailto:rivhome@example.com" title="Email" class="social-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  padding: 1.5rem;
  text-align: center;
}

.profile-avatar {
  margin-bottom: 1rem;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--vp-c-brand-1);
  transition: transform 0.3s;
}

.profile-avatar img:hover {
  transform: scale(1.05);
}

.profile-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: var(--vp-c-text-1);
}

.profile-bio {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.profile-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0 0 0.75rem;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.profile-social {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.social-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}
</style>
