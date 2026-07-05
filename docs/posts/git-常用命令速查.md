---
title: Git 常用命令速查
date: 2026-07-01 11:00:00
tags: [Git, 工具]
categories: [教程, DevOps]
pinned: true
---

## 🔧 Git 常用命令速查

Git 是现代软件开发中不可或缺的版本控制工具。本文整理了日常开发中最常用的 Git 命令。

### 基本操作

```bash
# 克隆仓库
git clone <repo-url>

# 查看状态
git status

# 添加变更
git add <file>      # 添加特定文件
git add .           # 添加所有变更

# 提交
git commit -m "提交信息"

# 推送
git push origin main
```

### 分支管理

```bash
# 创建分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>
git switch <branch-name>

# 创建并切换
git checkout -b <branch-name>

# 合并分支
git merge <branch-name>

# 删除分支
git branch -d <branch-name>
```

### 撤销操作

```bash
# 撤销工作区修改
git restore <file>

# 撤销暂存区
git restore --staged <file>

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1
```

### 查看历史

```bash
# 简洁日志
git log --oneline

# 图形化日志
git log --graph --oneline --all

# 查看某次提交详情
git show <commit-hash>
```

### 实用技巧

```bash
# 储藏当前修改
git stash
git stash pop

# 修改最近一次提交信息
git commit --amend -m "新信息"

# 查看远程仓库
git remote -v
```

这些命令覆盖了日常开发的绝大部分场景，建议收藏查阅。
