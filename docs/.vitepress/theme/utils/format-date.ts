/**
 * 日期格式化为 ISO 风格 `YYYY-MM-DD`（withYear 为 false 时返回 `MM-DD`，
 * 用于按年分组的列表——年份已由分组标题表达）。
 */
export function formatDate(date: Date | string | number, withYear = true): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return withYear ? `${y}-${m}-${day}` : `${m}-${day}`
}
