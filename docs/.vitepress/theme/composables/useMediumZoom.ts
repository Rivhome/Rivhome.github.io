import { onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'
import { useRoute } from 'vitepress'

export function useMediumZoom() {
  const route = useRoute()
  let zoom: ReturnType<typeof mediumZoom> | null = null

  const initZoom = () => {
    // Detach previous zoom instance to avoid stale DOM references
    if (zoom) {
      zoom.detach()
      zoom = null
    }
    // Only initialize if there are images to zoom
    const images = document.querySelectorAll('.main img')
    if (images.length > 0) {
      zoom = mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
  }

  onMounted(initZoom)
  watch(
    () => route.path,
    () => nextTick(initZoom),
  )
}
