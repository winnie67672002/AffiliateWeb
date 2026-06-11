import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

/**
 * Transforms ::affiliate[id] (leafDirective) into a HAST
 * <affiliate-card id="..."> element that react-markdown maps to
 * the AffiliateCard React component via the `components` prop.
 *
 * Markdown usage:  ::affiliate[keychron-k2]
 */
const affiliatePlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'leafDirective', (node: any) => {
    if (node.name !== 'affiliate') return

    // Label [id] lands as the first child text node
    const id: string =
      node.attributes?.id ??
      node.children?.[0]?.value?.trim() ??
      ''

    node.data = {
      ...node.data,
      hName: 'affiliate-card',
      hProperties: { affiliateid: id },
    }
    node.children = []
  })
}

export default affiliatePlugin
