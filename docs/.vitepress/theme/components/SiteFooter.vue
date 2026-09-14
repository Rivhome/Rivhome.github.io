<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <span class="copyright">© {{ year }} Rivhome</span>
      <nav class="footer-links" aria-label="页脚导航">
        <a href="/stats">统计</a>
        <a href="/changelog">更新日志</a>
        <a href="https://github.com/Rivhome" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--bl-divider);
  margin-top: var(--bl-space-20);
}

.footer-inner {
  max-width: var(--bl-width-content);
  margin: 0 auto;
  padding: var(--bl-space-6) 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--bl-space-3);
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.footer-links {
  display: flex;
  gap: var(--bl-space-4);
}

.footer-links a {
  color: var(--bl-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--bl-accent);
}

@media (max-width: 768px) {
  .footer-inner {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
