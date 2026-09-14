<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

function onScroll() {
  show.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade">
    <button v-if="show" class="back-to-top" @click="scrollToTop" aria-label="回到顶部">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  border-radius: var(--bl-radius-full);
  background: var(--bl-bg);
  color: var(--bl-text-2);
  border: 1px solid var(--bl-border-strong);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--bl-shadow-float);
  transition: color 0.2s, border-color 0.2s;
  z-index: 50;
}

.back-to-top:hover {
  color: var(--bl-accent);
  border-color: var(--bl-accent);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
