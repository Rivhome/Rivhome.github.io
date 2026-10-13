/**
 * 标签 / 合集 slug 归一化。
 *
 * 中文标题保持原样（URL 中由浏览器编码），拉丁字符转小写，
 * 空白转连字符，剔除文件系统与 URL 中不安全或易歧义的字符。
 * 校验规则：同名 slug 冲突由 taxonomy 侧在构建期告警。
 */
const UNSAFE = /[/\\:*?"<>|#%&{}$!'@+`=~^;[\](),]/g

export function slugify(input: string): string {
  const slug = input
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(UNSAFE, '')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')

  return slug || 'untitled'
}
