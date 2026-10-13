import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'

// 自托管变量字体（family 名：Inter Variable / JetBrains Mono Variable）
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'

import BlogLayout from './BlogLayout.vue'
import './styles/index.css'

/**
 * 页面组件在各自的 .md 中显式 import（见 docs/series|tags/*.md、docs/about.md），
 * 不再做全局注册，避免隐式全局命名空间。
 */
export default {
  extends: DefaultTheme,
  Layout: BlogLayout,
} satisfies Theme
