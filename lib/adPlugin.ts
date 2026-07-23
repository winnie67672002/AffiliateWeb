import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

/**
 * Transforms ::ad[slot-id] (leafDirective) into a HAST
 * <ad-banner slot="..."> element that react-markdown maps to
 * the AdBanner React component via the `components` prop.
 *
 * Markdown usage:  ::ad[in-article-1]
 *
 * 這裡的 slot 名稱只是拿來對照，實際顯示的廣告單元要看
 * AdBanner 元件收到的 data-ad-slot（目前是同一個字串），
 * 之後申請到 Google AdSense 的正式廣告單元 ID 後，
 * 把對應的 slot 換成 AdSense 後台顯示的數字 ID 即可。
 */
const adPlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'leafDirective', (node: any) => {
    if (node.name !== 'ad') return

    // Label [slot] 會被解析成第一個 child text node
    const slot: string =
      node.attributes?.slot ??
      node.children?.[0]?.value?.trim() ??
      ''

    node.data = {
      ...node.data,
      hName: 'ad-banner',
      hProperties: { slot },
    }
    node.children = []
  })
}

export default adPlugin
