import type MarkdownIt from 'markdown-it'

/**
 * 图片图注插件。
 *
 * 写法：`![替代文本](/images/a.png "这里是图注")`
 * 仅当「一个段落里只有这一张图片，且该图片带 title」时，
 * 才把段落渲染成 <figure> + <figcaption>；其余情况保持 Markdown 默认行为。
 *
 * 不使用 markdown-it 的 renderer 覆写，而是在 core 阶段改写 token，
 * 这样段落包裹关系与其它插件的输出都不受影响。
 */
export function figurePlugin(md: MarkdownIt): void {
  md.core.ruler.after('inline', 'blog-figure', (state) => {
    const tokens = state.tokens

    for (let i = 0; i < tokens.length; i++) {
      const open = tokens[i]
      if (open.type !== 'paragraph_open') continue

      const inline = tokens[i + 1]
      const close = tokens[i + 2]
      if (!inline || inline.type !== 'inline' || !close || close.type !== 'paragraph_close') {
        continue
      }

      const children = inline.children ?? []
      const images = children.filter((token) => token.type === 'image')
      if (images.length !== 1) continue

      const image = images[0]
      const caption = image.attrGet('title')
      if (!caption) continue

      // 段落里除图片外只允许空白文本，否则不做转换
      const otherContent = children.filter(
        (token) => token.type !== 'image' && !(token.type === 'text' && token.content.trim() === ''),
      )
      if (otherContent.length > 0) continue

      const escape = md.utils.escapeHtml
      const src = image.attrGet('src') ?? ''
      const alt = image.attrGet('alt') || image.content || caption

      open.type = 'html_block'
      open.tag = ''
      open.block = true
      open.content =
        '<figure class="blog-figure">' +
        `<img src="${escape(src)}" alt="${escape(alt)}" loading="lazy" decoding="async">` +
        `<figcaption>${escape(caption)}</figcaption>` +
        '</figure>\n'

      tokens.splice(i + 1, 2)
    }

    return true
  })
}
