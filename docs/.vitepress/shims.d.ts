/**
 * TypeScript 只检查 .ts（本项目未引入 vue-tsc），
 * 因此需要为 .vue 与 css 副作用导入提供声明，否则 tsc 会报 TS2307 / TS2882。
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {}
