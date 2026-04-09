---
title: 如何搭建个人博客：hexo + githubpages
date: 2025-11-23 13:01:29
tags: 博客搭建
---

## 💻 零成本打造你的极客博客：Hexo + GitHub Pages 完整指南

作为一名学习计算机的学生，搭建个人博客是展示技术能力、沉淀学习笔记的最佳实践。本指南将带你从零开始，使用 **Hexo (静态博客框架) + GitHub Pages (免费托管)** 方案，打造一个高度定制化的技术博客，整个过程**完全免费**。

### 🚀 核心方案概述

| 角色 | 技术栈 | 作用 | 成本 | 适合人群 |
| :--- | :--- | :--- | :--- | :--- |
| **框架** | Hexo (Node.js) | 将 Markdown 编译成静态网页 | ¥0 | 内容快速发布 |
| **服务器**| GitHub Pages | 免费托管你的网页文件 | ¥0 | 永久在线访问 |
| **主题** | NexT | 极简、代码高亮、程序员必备风格 | ¥0 | 追求专业和稳定 |

-----

### 第一阶段：环境准备与安装

环境混乱是初学者最容易遇到的问题。确保你的环境是干净且稳定的。

#### 1\. 软件安装 (Git & Node.js)

请确保你的电脑上安装了 Git 和 Node.js。

> **⚠️ 版本警告：**
> 如果之前有安装残留导致报错，请彻底删除残留文件后，安装 **LTS (长期支持版，推荐 v20+)**。LTS 版本稳定且兼容性最好，是技术博客的首选。

#### 2\. 设置 npm 国内镜像 (可选，但推荐)

为防止下载依赖时卡顿或失败，建议切换镜像源：

```bash
npm config set registry https://registry.npmmirror.com
```

#### 3\. 安装 Hexo 脚手架

在终端全局安装 Hexo 命令行工具：

```bash
npm install -g hexo-cli
```

-----

### 第二阶段：本地博客初始化

找到一个合适的文件夹（如 `D:\`），开始创建你的项目。

#### 1\. 初始化项目

```bash
hexo init myblog
cd myblog
npm install
```

#### 2\. 第一次本地预览

在终端运行，并在浏览器访问 `http://localhost:4000`，确认默认博客已启动。

```bash
hexo server
```

*(在终端按 `Ctrl + C` 即可停止服务)*

-----

### 第三阶段：上线部署 (GitHub Pages)

这是将你的本地成果推向互联网的关键步骤。

#### 1\. 创建 GitHub 仓库 (Repository)

登录 GitHub，创建新的仓库，**仓库名必须严格命名为：`你的用户名.github.io`**。

#### 2\. 安装部署插件

回到本地项目文件夹（`myblog`），安装 Git 部署插件：

```bash
npm install hexo-deployer-git --save
```

#### 3\. 配置部署信息

打开项目根目录下的 **`_config.yml`** 文件，拉到最底部，修改 `deploy:` 字段：

```yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io.git
  branch: main  # 或者 master，取决于你的 GitHub 仓库默认分支
```

*(注意：冒号后面必须有空格)*

#### 4\. 首次发布

依次运行命令，将网站发布到 GitHub Pages：

```bash
hexo clean   # 清除缓存
hexo g       # 生成静态文件 (Generate)
hexo d       # 部署到 GitHub (Deploy)
```

**恭喜！** 等待 1-2 分钟，访问 `https://你的用户名.github.io`，你的博客就正式上线了！

-----

### 第四阶段：个性化定制与内容发布

博客上线后，我们进行品牌化和美化。

#### 1\. 配置站点信息

在根目录的 `_config.yml` 中，修改你的**网站标题、作者和语言**：

```yaml
# Site
title: Rivhome 的技术笔记
author: Rivhome
language: zh-CN
```

#### 2\. 安装极客主题 (NexT)

为了让博客更具专业感，我们安装 NexT 主题：

```bash
git clone https://github.com/next-theme/hexo-theme-next themes/next
```

然后，在**根目录**的 `_config.yml` 中，将 `theme: landscape` 改为 `theme: next`。

#### 3\. 配置主题样式

打开 `themes/next/_config.yml` (注意是主题目录下的配置)。搜索 `Scheme`，推荐启用 `Gemini` 风格（经典左侧侧边栏）：

```yaml
# Schemes
# scheme: Muse
# scheme: Pisces
scheme: Gemini
```

*(注释掉其他，只保留 `scheme: Gemini`)*

#### 4\. 添加头像与品牌化

在 `themes/next/_config.yml` 中，找到 `avatar` 字段，并指定你头像的路径：

1.  将头像图片（如 `my-avatar.jpg`）放入 `source/images/` 文件夹。
2.  修改配置：
    ```yaml
    avatar:
      url: /images/my-avatar.jpg
    ```

#### 5\. 发布文章的流程

日常写作只需要记住以下 4 步：

1.  **创建文件：** `hexo new "文章标题"`
2.  **编辑内容：** 在 `source/_posts` 找到文件，用 Markdown 写作（内容写在 `---` 之后）。
3.  **本地测试：** `hexo s` 预览。
4.  **发布上线：** `hexo clean && hexo g && hexo d`

-----

### 总结：你的第一个里程碑

通过这个过程，你不仅拥有了一个零成本的个人网站，更掌握了 Git 工作流、静态网站生成和 CI/CD（手动版）的思维。这对于你的IT学习之路，是非常宝贵的实战经验！

**祝你的技术博客创作之路一帆风顺！**
