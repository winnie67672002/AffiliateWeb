// Shared data for the /mouse topic cluster.
// Product facts are sourced from the canonical comparison article
// (/best-wireless-mouse-productivity-2026) so numbers stay consistent
// across the hub page and every cluster sub-page — no invented specs.

export interface MouseClusterProduct {
  name: string
  dpi: string
  battery: string
  multiDevice: string
  bestFor: string
  price: string
  href: string
}

export const MOUSE_PRODUCTS: MouseClusterProduct[] = [
  {
    name: 'Logitech MX Master 3S',
    dpi: '200–8,000',
    battery: '約 70 天（USB-C）',
    multiDevice: '3 台',
    bestFor: '長時間辦公 / 上班族',
    price: 'NT$2,700–2,990',
    href: '/best-wireless-mouse-productivity-2026#pick-1',
  },
  {
    name: 'Logitech M720 Triathlon',
    dpi: '200–2,400',
    battery: '2 年（AA 電池）',
    multiDevice: '3 台',
    bestFor: '工程師 / 多設備切換',
    price: 'NT$1,290–1,980',
    href: '/best-wireless-mouse-productivity-2026#pick-2',
  },
  {
    name: 'Razer Pro Click V2',
    dpi: '100–30,000',
    battery: '約 400 小時（AA 電池）',
    multiDevice: '5 台',
    bestFor: '設計師 / 高精度需求',
    price: 'NT$3,990–4,590',
    href: '/best-wireless-mouse-productivity-2026#pick-3',
  },
  {
    name: 'Logitech MX Anywhere 3S',
    dpi: '200–8,000',
    battery: '約 70 天（USB-C）',
    multiDevice: '3 台',
    bestFor: '商務出差 / 隨身攜帶',
    price: 'NT$1,590–1,990',
    href: '/best-wireless-mouse-productivity-2026#pick-4',
  },
  {
    name: 'Logitech Pebble M350s',
    dpi: '400–4,000',
    battery: '18 個月（AA 電池）',
    multiDevice: '2 台',
    bestFor: '學生 / 預算有限',
    price: 'NT$590–890',
    href: '/best-wireless-mouse-productivity-2026#pick-5',
  },
]

export interface MouseClusterPage {
  slug: string
  title: string
  navLabel: string
}

// Single source of truth for hub nav + sitemap generation.
export const MOUSE_CLUSTER_PAGES: MouseClusterPage[] = [
  { slug: 'what-is-dpi', title: '滑鼠 DPI 是什麼？多少才夠用？', navLabel: 'DPI 是什麼？' },
  { slug: 'best-mouse-for-office', title: '上班族滑鼠推薦：辦公室滑鼠怎麼選？', navLabel: '上班族滑鼠推薦' },
  { slug: 'mouse-vs-trackpad', title: '滑鼠 vs 觸控板：辦公/設計工作該選哪個？', navLabel: '滑鼠 vs 觸控板' },
  { slug: 'best-mouse-for-mac', title: 'Mac 滑鼠怎麼選？2026 相容性與推薦整理', navLabel: 'Mac 滑鼠怎麼選' },
]
