---
layout: page
title: 标签
---

<script setup lang="ts">
import { useData } from 'vitepress'
import TagDetail from '../.vitepress/theme/components/TagDetail.vue'

const { params } = useData()
</script>

<div class="blog-page">

<TagDetail :slug="String(params.tag ?? '')" />

</div>
