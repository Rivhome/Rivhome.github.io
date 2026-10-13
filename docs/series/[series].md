---
layout: page
title: 合集
---

<script setup lang="ts">
import { useData } from 'vitepress'
import SeriesDetail from '../.vitepress/theme/components/SeriesDetail.vue'

const { params } = useData()
</script>

<div class="blog-page">

<SeriesDetail :slug="String(params.series ?? '')" />

</div>
