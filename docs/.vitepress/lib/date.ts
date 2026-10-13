/**
 * 日期工具。全部基于「本地墙上时间」，不使用 toISOString()，
 * 避免 UTC+8 等时区下日期键偏移到前一天。
 */

/**
 * 解析 front matter 里的日期。YAML 会把合法时间戳解析成 Date
 * （无时区时按 UTC 处理），这里还原为墙上时间；无效值回退 fallback
 * 并由调用方决定是否告警。
 */
export function resolveDate(v: unknown, fallback: Date): { date: Date; ok: boolean } {
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return {
      date: new Date(
        v.getUTCFullYear(),
        v.getUTCMonth(),
        v.getUTCDate(),
        v.getUTCHours(),
        v.getUTCMinutes(),
        v.getUTCSeconds(),
      ),
      ok: true,
    }
  }

  if (typeof v === 'string' && v.trim()) {
    const d = new Date(v.trim().replace(' ', 'T'))
    if (!Number.isNaN(d.getTime())) return { date: d, ok: true }
  }

  return { date: fallback, ok: false }
}

/** 格式化为 `YYYY-MM-DD`；withYear 为 false 时返回 `MM-DD`（按年分组的列表用） */
export function formatDate(date: Date | string | number, withYear = true): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return withYear ? `${y}-${m}-${day}` : `${m}-${day}`
}

/** 本地日期键 `YYYY-MM-DD`（按天统计、排序键） */
export function toDateKey(date: Date): string {
  return formatDate(date)
}

/** `YYYY-MM`（按月分组） */
export function toMonthKey(date: Date): string {
  return formatDate(date).slice(0, 7)
}

/** b 相对 a 过去的天数（向下取整，可为 0） */
export function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  return Math.max(0, Math.floor((end - start) / 86_400_000))
}

/** front matter 注入用：稳定可序列化的 ISO 字符串 */
export function toIso(date: Date): string {
  return date.toISOString()
}
