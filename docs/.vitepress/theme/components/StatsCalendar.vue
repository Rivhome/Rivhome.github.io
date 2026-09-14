<script setup lang="ts">
import { computed } from 'vue'

interface DailyPost {
  date: string
  count: number
  level: number
}

const props = defineProps<{
  dailyPosts: DailyPost[]
}>()

// 品牌蓝阶热力图（见 tokens.css --bl-heat-*）
const levelColors = [
  'var(--bl-heat-0)',
  'var(--bl-heat-1)',
  'var(--bl-heat-2)',
  'var(--bl-heat-3)',
  'var(--bl-heat-4)',
]

const weekDays = ['', '一', '', '三', '', '五', '']

// Group posts into weeks for the calendar layout
const weeks = computed(() => {
  const result: DailyPost[][] = []
  let currentWeek: DailyPost[] = []

  // Pad to start from Monday
  const firstDate = new Date(props.dailyPosts[0]?.date || new Date())
  const firstDay = firstDate.getDay() || 7 // Convert Sunday (0) to 7
  for (let i = 1; i < firstDay; i++) {
    currentWeek.push({ date: '', count: 0, level: -1 })
  }

  props.dailyPosts.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      result.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    result.push(currentWeek)
  }

  return result
})

const monthLabels = computed(() => {
  const labels: Array<{ label: string; col: number }> = []
  let lastMonth = ''
  weeks.value.forEach((week, weekIndex) => {
    week.forEach((day) => {
      if (day.date && day.level >= 0) {
        const month = day.date.slice(5, 7)
        if (month !== lastMonth) {
          labels.push({
            label: `${parseInt(month)}月`,
            col: weekIndex,
          })
          lastMonth = month
        }
      }
    })
  })
  return labels
})

function formatTooltip(date: string, count: number): string {
  return `${date}: ${count} 篇文章`
}
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="month-labels">
        <span
          v-for="(ml, i) in monthLabels"
          :key="i"
          class="month-label"
          :style="{ left: `${24 + ml.col * 15}px` }"
        >{{ ml.label }}</span>
      </div>
    </div>
    <div class="calendar-body">
      <div class="weekday-col">
        <span v-for="(d, i) in weekDays" :key="i" class="weekday-label">{{ d }}</span>
      </div>
      <div class="calendar-grid" v-if="weeks.length > 0">
        <div v-for="(week, wi) in weeks" :key="wi" class="week-row">
          <div
            v-for="(day, di) in week"
            :key="di"
            class="day-cell"
            :class="{ empty: day.level < 0 }"
            :style="{ background: day.level >= 0 ? levelColors[day.level] : 'transparent' }"
            :title="day.date ? formatTooltip(day.date, day.count) : ''"
          />
        </div>
      </div>
    </div>
    <div class="calendar-legend">
      <span class="legend-label">少</span>
      <span
        v-for="(color, i) in levelColors"
        :key="i"
        class="legend-cell"
        :style="{ background: color }"
      />
      <span class="legend-label">多</span>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.calendar-header {
  margin-bottom: 4px;
  position: relative;
  height: 18px;
}

/* 月份标签绝对定位：24px 为星期列宽，每周列宽 12px + 3px 间距 = 15px */
.month-labels {
  position: relative;
  height: 100%;
}

.month-label {
  position: absolute;
  top: 0;
  font-size: 0.7rem;
  color: var(--bl-text-3);
  white-space: nowrap;
}

.calendar-body {
  display: flex;
  gap: 0;
}

.weekday-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-right: 4px;
  padding-top: 2px;
}

.weekday-label {
  font-size: 0.65rem;
  color: var(--bl-text-3);
  height: 12px;
  line-height: 12px;
  width: 20px;
  text-align: right;
  padding-right: 4px;
}

.calendar-grid {
  display: flex;
  gap: 3px;
}

.week-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.day-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  position: relative;
}

.day-cell.empty {
  background: transparent !important;
}

.calendar-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-top: 0.75rem;
  font-size: 0.7rem;
  color: var(--bl-text-3);
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
