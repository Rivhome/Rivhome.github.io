<script setup lang="ts">
const nickname = 'Rivhome'
const bio = 'changing world, one line of code at a time'
</script>

<template>
  <section class="greeting">
    <div class="greeting-main">
      <img class="greeting-avatar" src="/images/my-avatar.jpg" :alt="nickname" />
      <h1 class="greeting-title">你好，我是 {{ nickname }}。</h1>
    </div>
    <p class="greeting-bio">{{ bio }}</p>
    <div class="greeting-social">
      <a
        href="https://github.com/Rivhome"
        target="_blank"
        rel="noopener"
        title="GitHub"
        class="social-link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.greeting {
  margin-bottom: var(--bl-space-20);
}

.greeting-main {
  display: flex;
  align-items: center;
  gap: var(--bl-space-3);
}

.greeting-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--bl-radius-full);
  object-fit: cover;
  flex-shrink: 0;
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
  margin: var(--bl-space-2) 0 0;
  font-size: 0.9375rem;
  color: var(--bl-text-2);
}

.greeting-social {
  display: flex;
  gap: var(--bl-space-2);
  margin-top: var(--bl-space-4);
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--bl-radius-sm);
  color: var(--bl-text-3);
  transition: color 0.2s, background-color 0.2s;
}

.social-link:hover {
  color: var(--bl-accent);
  background: var(--bl-accent-soft);
}

@media (max-width: 768px) {
  .greeting-title {
    font-size: 1.75rem;
  }
}
</style>
