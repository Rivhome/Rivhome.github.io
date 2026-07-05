---
layout: doc
title: 统计
aside: false
---

<script setup lang="ts">
import { data as stats } from '.vitepress/stats.data'
import { data as posts } from '.vitepress/posts.data'

const sortedByMonth = Object.entries(stats.postsByMonth).sort((a, b) => b[0].localeCompare(a[0]))
const sortedByYear = Object.entries(stats.postsByYear).sort((a, b) => b[0].localeCompare(a[0]))
const maxMonthCount = Math.max(...sortedByMonth.map(([, c]) => c), 1)

function formatMonth(ym: string): string {
  const [y, m] = ym.split('-')
  return `${parseInt(m)}月`
}
</script>

<div class="stats-page">
  <div class="page-header">
    <h1>统计</h1>
  </div>

  <!-- Overview Stats -->
  <div class="overview-cards">
    <div class="overview-card">
      <span class="overview-num">{{ stats.totalPosts }}</span>
      <span class="overview-label">总文章数</span>
    </div>
    <div class="overview-card">
      <span class="overview-num">{{ stats.streakDays }}</span>
      <span class="overview-label">连续写作天数</span>
    </div>
    <div class="overview-card">
      <span class="overview-num">{{ stats.totalTags }}</span>
      <span class="overview-label">标签数</span>
    </div>
    <div class="overview-card">
      <span class="overview-num">{{ stats.totalCategories }}</span>
      <span class="overview-label">分类数</span>
    </div>
  </div>

  <!-- Calendar Heatmap -->
  <section class="stats-section">
    <h2>写作日历</h2>
    <StatsCalendar :daily-posts="stats.dailyPosts" />
  </section>

  <!-- Monthly Bar Chart -->
  <section class="stats-section">
    <h2>月度发布趋势</h2>
    <div class="bar-chart">
      <div v-for="[month, count] in sortedByMonth.slice(0, 12)" :key="month" class="bar-item">
        <div class="bar-label">{{ formatMonth(month) }}</div>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: (count / maxMonthCount * 100) + '%' }"
          />
        </div>
        <div class="bar-count">{{ count }}</div>
      </div>
    </div>
  </section>

  <!-- Yearly Stats -->
  <section class="stats-section">
    <h2>年度统计</h2>
    <div class="year-table">
      <div v-for="[year, count] in sortedByYear" :key="year" class="year-row">
        <span class="year-name">{{ year }}</span>
        <span class="year-count">{{ count }} 篇</span>
      </div>
    </div>
  </section>

  <!-- Recent Posts Timeline -->
  <section class="stats-section">
    <h2>最近更新</h2>
    <ChangelogList :posts="posts.slice(0, 10)" />
  </section>

  <div v-if="stats.totalPosts === 0" class="empty-state">
    <p>暂无数据</p>
  </div>
</div>

<style scoped>
.stats-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  transition: transform 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.overview-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
}

.overview-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}

.stats-section {
  margin-bottom: 2.5rem;
}

.stats-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

/* Bar chart */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bar-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  min-width: 3rem;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 22px;
  background: var(--vp-c-default-soft);
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 6px;
  transition: width 0.5s ease;
  min-width: 4px;
}

.bar-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 2rem;
  text-align: left;
}

/* Year table */
.year-table {
  display: flex;
  flex-direction: column;
}

.year-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.year-row:last-child {
  border-bottom: none;
}

.year-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.year-count {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .stats-page {
    padding: 1rem 1rem 3rem;
  }
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
