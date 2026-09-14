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

const changelogPosts = posts
  .map((p) => ({ ...p, sortDate: new Date(p.updated || p.date) }))
  .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())

function formatMonth(ym: string): string {
  const [, m] = ym.split('-')
  return `${parseInt(m)}月`
}
</script>

<div class="stats-page">
  <div class="page-header">
    <h1>统计</h1>
  </div>

  <!-- 总览数字：纯排版 -->
  <div class="overview">
    <div class="overview-item">
      <span class="num">{{ stats.totalPosts }}</span>
      <span class="label">文章</span>
    </div>
    <div class="overview-item">
      <span class="num">{{ stats.totalWords.toLocaleString('zh-CN') }}</span>
      <span class="label">总字数</span>
    </div>
    <div class="overview-item">
      <span class="num">{{ stats.streakDays }}</span>
      <span class="label">连续写作天数</span>
    </div>
    <div class="overview-item">
      <span class="num">{{ stats.totalTags }}</span>
      <span class="label">标签</span>
    </div>
    <div class="overview-item">
      <span class="num">{{ stats.totalCategories }}</span>
      <span class="label">分类</span>
    </div>
  </div>

  <!-- 写作日历 -->
  <section class="stats-section">
    <h2>写作日历</h2>
    <StatsCalendar :daily-posts="stats.dailyPosts" />
  </section>

  <!-- 月度发布趋势 -->
  <section class="stats-section">
    <h2>月度发布趋势</h2>
    <div class="bar-chart">
      <div v-for="[month, count] in sortedByMonth.slice(0, 12)" :key="month" class="bar-item">
        <div class="bar-label">{{ formatMonth(month) }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: (count / maxMonthCount) * 100 + '%' }" />
        </div>
        <div class="bar-count">{{ count }}</div>
      </div>
    </div>
  </section>

  <!-- 年度统计 -->
  <section class="stats-section">
    <h2>年度统计</h2>
    <div class="year-table">
      <div v-for="[year, count] in sortedByYear" :key="year" class="year-row">
        <span class="year-name">{{ year }}</span>
        <span class="year-count">{{ count }} 篇</span>
      </div>
    </div>
  </section>

  <!-- 最近更新 -->
  <section class="stats-section">
    <h2>最近更新</h2>
    <ChangelogList :posts="changelogPosts.slice(0, 10)" />
  </section>

  <div v-if="stats.totalPosts === 0" class="empty-state">
    <p>暂无数据</p>
  </div>
</div>

<style scoped>
.stats-page {
  padding: var(--bl-space-10) 0 0;
}

.page-header h1 {
  margin: 0;
}

/* 总览数字：纯排版，无卡片 */
.overview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bl-space-4) var(--bl-space-8);
  margin: var(--bl-space-5) 0 var(--bl-space-6);
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.num {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--bl-text-1);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.label {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.stats-section {
  margin-top: 2.5rem;
}

/* 页面内小节标题：比全局 prose h2 更紧凑 */
.stats-section h2 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: var(--bl-text-h3);
}

/* 月度柱状图：单色 */
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
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
  min-width: 3rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar-track {
  flex: 1;
  height: 16px;
  background: var(--bl-bg-soft);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--bl-accent);
  border-radius: 2px;
  transition: width 0.5s ease;
  min-width: 4px;
}

.bar-count {
  font-size: var(--bl-text-small);
  font-weight: 600;
  color: var(--bl-text-1);
  min-width: 2rem;
  text-align: left;
  font-variant-numeric: tabular-nums;
}

/* 年度统计 */
.year-table {
  display: flex;
  flex-direction: column;
}

.year-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--bl-divider);
}

.year-row:last-child {
  border-bottom: none;
}

.year-name {
  font-size: var(--bl-text-body);
  font-weight: 500;
  color: var(--bl-text-1);
  font-variant-numeric: tabular-nums;
}

.year-count {
  font-size: var(--bl-text-small);
  color: var(--bl-text-3);
}

.empty-state {
  text-align: center;
  padding: var(--bl-space-20) 0;
  color: var(--bl-text-3);
}
</style>
