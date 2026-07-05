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

const levelColors = [
  'var(--vp-c-bg-soft)',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
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
          :style="{ gridColumn: ml.col + 2 }"
        >{{ ml.label }}</span>
      </div>
    </div>
    <div class="calendar-body">
      <div class="weekday-col">
        <span v-for="(d, i) in weekDays" :key="i" class="weekday-label">{{ d }}</span>
      </div>
      <div class="calendar-grid" v-if="weeks.length > 0">
        <div
          v-for="week in weeks"
          :key="week[0]?.date || Math.random()"
          class="week-row"
        >
          <div
            v-for="day in week"
            :key="day.date || Math.random()"
            class="day-cell"
            :class="{ empty: day.level < 0 }"
            :style="{ background: day.level >= 0 ? levelColors[day.level] : 'transparent' }"
            :title="day.date ? formatTooltip(day.date, day.count) : ''"
          >
            <span class="day-tooltip" v-if="day.date && day.count > 0">{{ day.date }}: {{ day.count }}篇</span>
          </div>
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
  margin-bottom: 0.5rem;
  position: relative;
  height: 22px;
}

.month-labels {
  display: flex;
  padding-left: 36px;
}

.month-label {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
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
  color: var(--vp-c-text-3);
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
  cursor: pointer;
  transition: outline 0.1s;
}

.day-cell.empty {
  background: transparent !important;
}

.day-cell:hover .day-tooltip {
  display: block;
}

.day-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.7rem;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  white-space: nowrap;
  border: 1px solid var(--vp-c-divider);
  z-index: 10;
  pointer-events: none;
}

.calendar-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-top: 0.75rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
