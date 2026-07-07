import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AffiliateButton from '@/components/AffiliateButton'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import ProductListSchema from '@/components/schema/ProductListSchema'

export const metadata: Metadata = {
  title: 'iPhone 行動電源推薦 2026｜PTT/Dcard 熱門 MagSafe 磁吸行動電源 Top 3 評比',
  description:
    '2026 iPhone 行動電源推薦完整整理！實測 12+ 款 MagSafe 磁吸行動電源，包含 Anker、JV3C、CW 評比，並整理 PTT/Dcard 熱門推薦、飛機攜帶規範與 5000mAh / 10000mAh 選擇建議。',
  keywords: [
    'iPhone行動電源推薦2026',
    'MagSafe行動電源推薦',
    'PTT行動電源推薦',
    'Dcard行動電源',
    'iPhone快充行動電源',
    '10000mAh行動電源',
    '行動電源可以帶上飛機嗎'
  ],
  openGraph: {
    title: 'iPhone 行動電源推薦 2026｜PTT/Dcard 熱門 Top 3',
    description:
      '實測 12+ 款 iPhone 行動電源，整理 MagSafe / 快充 / 出國旅行最佳選擇',
    type: 'article',
    images: [{ url: '/images/anker-maggo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iPhone 行動電源推薦 2026｜PTT/Dcard 熱門 Top 3',
    description: '實測 12+ 款 iPhone 行動電源，整理 MagSafe / 快充 / 出國旅行最佳選擇',
    images: ['/images/anker-maggo.jpg'],
  },
  alternates: {
    canonical: '/best-power-bank-iphone-2026',
  },
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    rank: 1,
    badge: '✦ 最推薦',
    badgeColor: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    name: 'Anker MagGo 行動電源 10000',
    tagline: '2026 iPhone 最佳 MagSafe 行動電源',
    description:
      'Anker MagGo 10000 是大多數 iPhone 使用者的首選。支援 MagSafe 磁吸，最高 15W 無線充電 + 20W USB-C 快充，一次可充滿 iPhone 約 2 次以上，輕薄設計方便隨身攜帶。',
    pros: [
      'MagSafe 15W 磁吸快充',
      'USB-C PD 20W 快充',
      '10000mAh 可充 2 次以上 iPhone',
      '輕薄設計（215g）',
      '支援邊充邊用'
    ],
       cons: ['沒有電量數字顯示', '無線充電僅支援磁吸區'],
    capacity: '10,000mAh',
    weight: '215g',
    maxOutput: '20W',
    magsafe: true,
    price: 'NT$1,800–2,200',
    image: '/images/anker-maggo.jpg',
    href: 'https://s.shopee.tw/BRMU4jbUI',
    ctaText: '查看最新價格 →',
    accentColor: 'border-amber-200',
    topBarColor: 'from-amber-300 via-amber-400 to-amber-300',
  },
  {
    rank: 2,
    badge: '✦ Best for Travel',
    badgeColor: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    name: 'JV3C MAG Lite Qi2 行動電源',
    tagline: 'CCC 認證，搭機無壓力',
    description:
      '通過 CCC 認證，符合民航局規範，是長途飛行旅行者的首選。Qi2 磁吸充電相容 iPhone 12 以上機型，輕量機身搭配 LED 電量顯示，隨時掌握電量。',
    pros: ['CCC 航空認證', 'Qi2 磁吸 15W', 'LED 電量顯示', '輕量設計', '兩組輸出'],
    cons: ['容量較小', '無 USB-A 輸出'],
    capacity: '5,000mAh',
    weight: '160g',
    maxOutput: '15W',
    magsafe: true,
    price: 'NT$1,100–1,300',
    image: '/images/jv3c.jpg',
    href: 'https://s.shopee.tw/9fIRnNrYXJ',
    ctaText: '查看最新價格 →',
    accentColor: 'border-violet-200',
    topBarColor: 'from-violet-300 via-violet-400 to-violet-300',
  },
  {
    rank: 3,
    badge: '✦ Best Value',
    badgeColor: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    name: 'CW 極上超薄磁吸行動電源',
    tagline: '最輕薄 CP 值選擇',
    description:
      '追求輕量日常攜帶的最佳選擇。超薄機身只有 9mm，放進小包完全無感。磁吸設計相容 MagSafe，適合通勤族與小包使用者。',
    pros: ['超薄 9mm 機身', '磁吸 MagSafe 相容', '輕量 120g', 'CP 值極高', '日常通勤首選'],
    cons: ['容量較小', '充電速度較慢'],
    capacity: '5,000mAh',
    weight: '120g',
    maxOutput: '10W',
    magsafe: true,
    price: 'NT$800–1,000',
    image: '/images/cw-slim.jpg',
    href: 'https://s.shopee.tw/AAEiOOSC0q',
    ctaText: '查看最新價格 →',
    accentColor: 'border-emerald-200',
    topBarColor: 'from-emerald-300 via-emerald-400 to-emerald-300',
  },
]

const COMPARISON = [
  { label: '容量', key: 'capacity' },
  { label: '重量', key: 'weight' },
  { label: '最大輸出', key: 'maxOutput' },
  { label: 'MagSafe', key: 'magsafe' },
  { label: '參考售價', key: 'price' },
] as const

const FAQS = [
  {
    q: "iPhone 需要幾 mAh 的行動電源？",
    a: "iPhone 電池約 3000–4500mAh，5000mAh 可充滿 1 次，10000mAh 約可充 2 次以上，出國建議至少 10000mAh。",
  },
  {
    q: "行動電源可以帶上飛機嗎？",
    a: "可以，但必須隨身攜帶，不能托運。一般限制在 100Wh（約 27000mAh）以下。",
  },
  {
    q: "MagSafe 行動電源值得買嗎？",
    a: "如果你是 iPhone 12 以上使用者非常推薦，可以磁吸邊充邊用，不用插線更方便。",
  },
  {
    q: "哪一款充電最快？",
    a: "有線充電通常最快（USB-C PD 20W 以上），Anker MagGo 同時支援無線與有線快充。",
  },
  {
    q: "可以同時充多個裝置嗎？",
    a: "部分款式支援多輸出，例如 Anker MagGo 可以同時充手機與耳機。",
  },
  {
    q: "行動電源推薦買 5000mAh 還是 10000mAh？",
    a: "如果只是通勤或短時間外出，5000mAh 已經足夠。若經常出差、旅遊或重度使用手機，建議直接選擇 10000mAh，可提供約 2 次完整充電。",
  },
  {
    q: "MagSafe 與一般行動電源差在哪？",
    a: "MagSafe 行動電源可直接磁吸在 iPhone 背面，不需要充電線即可使用，攜帶更方便，也能邊走邊充。",
  },
  {
    q: "行動電源推薦品牌有哪些？",
    a: "目前最熱門的品牌包括 Anker、小米、Baseus、ADAM、LaPO 等，其中 Anker 在穩定性與充電效率方面普遍評價最高。",
  },
  {
    q: "行動電源推薦看 PTT 和 Dcard 哪款最多人買？",
    a: "近年在 PTT 與 Dcard 討論度最高的產品以 Anker MagGo 系列最受推薦，其次是 Baseus 與 LaPO 的磁吸系列。",
  },
  {
    q: "MagSafe 行動電源真的比較好用嗎？",
    a: "如果你是 iPhone 12 以上，用 MagSafe 可以直接磁吸充電，不用插線，適合邊走邊充，但充電速度會比有線慢一點。",
  },
  {
    q: "iPhone 行動電源推薦買 5000mAh 還是 10000mAh？",
    a: "5000mAh 適合通勤輕量使用，10000mAh 約可充 2 次 iPhone，更適合出國或重度使用。",
  },
 
];

const BUYING_GUIDE = [
  {
    icon: '⚡',
    title: '充電速度',
    body: '確認是否支援 USB-C PD 20W 以上有線快充，或 Qi2/MagSafe 15W 無線充電。一般 Qi 無線充電只有 5–7.5W，差距很大。',
  },
  {
    icon: '🧲',
    title: 'MagSafe / Qi2 相容性',
    body: 'iPhone 12 以上用戶建議選擇 MagSafe 相容款，可磁吸附著手機背面同步使用，免插線更方便。',
  },
  {
    icon: '✈️',
    title: '航空法規',
    body: '出國旅行必看！選擇通過 CCC 或 UN38.3 認證的產品，才能安心帶上飛機。容量不超過 100Wh（約 27,000mAh）。',
  },
  {
    icon: '⚖️',
    title: '容量 vs 重量',
    body: '日常通勤選 5,000mAh（輕量、不佔空間），長途旅行選 10,000mAh 以上。超過 20,000mAh 的款式通常不允許上飛機。',
  },
  
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProConList({ items, type }: { items: string[]; type: 'pro' | 'con' }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
          <span className={`shrink-0 mt-0.5 font-bold ${type === 'pro' ? 'text-emerald-500' : 'text-rose-400'}`}>
            {type === 'pro' ? '✓' : '✗'}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-extrabold flex items-center justify-center shadow-md">
      {rank}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BestPowerBankPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '文章', url: '/blog' },
          { name: '2026 iPhone 行動電源推薦', url: '/best-power-bank-iphone-2026' },
        ]}
      />
      <FaqSchema faqs={FAQS} />
      <ProductListSchema
        products={PRODUCTS.map((p) => ({
          name: p.name,
          description: p.description,
          image: p.image,
          url: p.href,
          position: p.rank,
        }))}
      />
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          首頁
        </Link>
        <span className="text-gray-200">/</span>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">
          文章
        </Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500 truncate">
          2026 iPhone 行動電源推薦{" "}
        </span>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full bg-white">
            行動電源推薦
          </span>
          <time className="text-sm text-gray-400">2026年最新版</time>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          2026 iPhone 行動電源推薦 <br />
          <span className="text-gray-400 font-bold">Top 3 實測推薦</span>
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4 mb-8">
          iPhone 行動電源到底要買哪一款？ 很多人在 PTT、Dcard
          上都在問：「MagSafe 行動電源值得買嗎？」 「5000mAh 跟 10000mAh
          差在哪？」 「哪一款可以帶上飛機？」
          <br />
          <br />
          這篇直接幫你實測 12+ 款熱門 iPhone 行動電源， 從 MagSafe
          磁吸、快充速度、重量到出國限制全部整理好， 直接給你 2026 年最值得買的
          Top 3。
        </p>

        {/* Quick picks */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {PRODUCTS.map((p) => (
            <a
              key={p.rank}
              href={`#pick-${p.rank}`}
              className="
                flex flex-col gap-1 p-4 rounded-2xl
                border border-gray-200 bg-gray-50
                hover:bg-white hover:shadow-sm
                transition-all duration-150 no-underline
              "
            >
              <span
                className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full self-start ${p.badgeColor}`}
              >
                {p.badge}
              </span>
              <span className="text-sm font-semibold text-gray-900 leading-snug">
                {p.name}
              </span>
              <span className="text-xs text-gray-400">{p.price}</span>
            </a>
          ))}
        </div>

        {/* Hero CTA */}
        <div className="flex flex-wrap gap-3">
          <AffiliateButton href={PRODUCTS[0].href} productName={PRODUCTS[0].name}>查看 #1 推薦 →</AffiliateButton>
          <a
            href="#comparison"
            className="
              inline-flex items-center gap-2
              bg-white text-gray-700 text-sm font-medium
              px-6 py-3 rounded-xl
              border border-gray-200
              hover:border-gray-300 hover:bg-gray-50
              transition-all duration-150 no-underline
            "
          >
            比較所有規格 ↓
          </a>
        </div>
      </header>

      {/* ── TOP PICKS ──────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          2026 iPhone 行動電源推薦 Top 3
        </h2>

        <div className="space-y-10">
          {PRODUCTS.map((product) => (
            <div
              key={product.rank}
              id={`pick-${product.rank}`}
              className={`relative rounded-2xl border-2 ${product.accentColor} bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden`}
            >
              <RankBadge rank={product.rank} />

              {/* top bar */}
              <div
                className={`h-1 w-full bg-gradient-to-r ${product.topBarColor}`}
              />

              <div className="p-6 sm:p-7">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                  {product.image && (
                    <div className="shrink-0 w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <span
                      className={`text-[0.65rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 mt-2 mb-1 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 italic mb-2">
                      {product.tagline}
                    </p>

                    {/* Specs row */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { label: product.capacity },
                        { label: product.maxOutput },
                        { label: product.weight },
                        ...(product.magsafe ? [{ label: "MagSafe ✓" }] : []),
                      ].map((s) => (
                        <span
                          key={s.label}
                          className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Pros / Cons */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                      優點
                    </p>
                    <ProConList items={product.pros} type="pro" />
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">
                      缺點
                    </p>
                    <ProConList items={product.cons} type="con" />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-3">
                  <AffiliateButton
                    href={product.href}
                    productName={product.name}
                    className="flex-1 sm:flex-none"
                  >
                    {product.ctaText}
                  </AffiliateButton>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON TABLE ───────────────────────────────── */}
      <section id="comparison" className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          iPhone 行動電源規格比較
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          三款產品完整規格對比，幫你快速找到最適合的選擇。
        </p>

        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    規格
                  </th>
                  {PRODUCTS.map((p) => (
                    <th key={p.rank} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${p.badgeColor}`}
                        >
                          #{p.rank}
                        </span>
                        <span className="font-semibold text-gray-900 text-xs leading-tight max-w-[90px]">
                          {p.name.split(" ").slice(0, 3).join(" ")}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.key}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">
                      {row.label}
                    </td>
                    {PRODUCTS.map((p) => {
                      const val = p[row.key as keyof typeof p];
                      return (
                        <td key={p.rank} className="px-4 py-3 text-center">
                          {typeof val === "boolean" ? (
                            <span
                              className={
                                val
                                  ? "text-emerald-500 font-bold text-base"
                                  : "text-gray-300 text-base"
                              }
                            >
                              {val ? "✓" : "✗"}
                            </span>
                          ) : (
                            <span className="text-gray-700 font-medium text-xs">
                              {String(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">
                    購買
                  </td>
                  {PRODUCTS.map((p) => (
                    <td key={p.rank} className="px-4 py-3 text-center">
                      <AffiliateButton
                        href={p.href}
                        productName={p.name}
                        className="!text-xs !px-3 !py-1.5 !rounded-lg"
                      >
                        查看價格
                      </AffiliateButton>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── BUYING GUIDE ───────────────────────────────────── */}
      <section className="mb-16">
        <h3>iPhone 行動電源怎麼選？</h3>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          iPhone 行動電源選購指南
        </h2>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
          iPhone 行動電源怎麼選？
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          市面上的行動電源品牌非常多， 包含 Anker、小米、Baseus、LaPO、ADAM
          等熱門品牌。
          <br />
          如果你是 iPhone 使用者， 建議優先選擇支援 MagSafe 或 Qi2
          磁吸充電的款式， 不需要額外攜帶充電線即可直接吸附在手機背面使用。
          挑選時可以優先注意：
          <br />
          • 是否支援 MagSafe / Qi2
          <br />
          • 容量是否達到 10000mAh
          <br />
          • 是否支援 USB-C PD 快充
          <br />
          • 是否符合航空公司登機規範
          <br />
          • 重量是否適合日常攜帶
          <br />
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {BUYING_GUIDE.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1.5">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Use case recommendation */}
        <div className="rounded-2xl bg-gray-900 text-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            快速推薦對照
          </p>
          <div className="space-y-3">
            {[
              {
                use: "日常通勤、小包族",
                pick: "CW 極上超薄",
                href: PRODUCTS[2].href,
              },
              {
                use: "出國旅行、搭飛機",
                pick: "JV3C MAG Lite",
                href: PRODUCTS[1].href,
              },
              {
                use: "大多數 iPhone 用戶",
                pick: "Anker MagGo 10000",
                href: PRODUCTS[0].href,
              },
            ].map((item) => (
              <div
                key={item.use}
                className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0"
              >
                <div>
                  <span className="text-gray-400 text-xs">需求：</span>
                  <span className="text-white text-sm font-medium ml-1">
                    {item.use}
                  </span>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="shrink-0 text-xs font-semibold text-gray-900 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors no-underline"
                >
                  {item.pick} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CTA ───────────────────────────────────── */}
      <section className="mb-16 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 sm:p-8 text-center">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
          編輯首選
        </p>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
          Anker MagGo 10000
        </h3>
        <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
          最適合大多數 iPhone 用戶——MagSafe 15W 無線 + 20W 有線快充，10,000mAh
          撐兩天沒問題。
        </p>
        <AffiliateButton href={PRODUCTS[0].href} productName={PRODUCTS[0].name} className="mx-auto">
          查看 Anker MagGo 最新價格 →
        </AffiliateButton>
        <p className="text-xs text-amber-600 mt-3">
          * 此為聯盟行銷連結，不影響你的購買價格
        </p>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          為什麼推薦 MagSafe 行動電源？
        </h2>
        <h3>
          MagSafe 行動電源是近年 iPhone 使用者最熱門的配件之一。
          <br />
          相較於傳統行動電源需要額外攜帶充電線， MagSafe 行動電源能直接吸附在
          iPhone 背面， 邊走邊充電更加方便。
          <br />
          若選擇支援 Qi2 標準的產品， 最高可提供 15W 無線快充速度，
          比一般無線充電效率更高。
          <br />
          因此如果你使用的是 iPhone 12、13、14、15 或 iPhone 16 系列， MagSafe
          行動電源通常會是最值得優先考慮的選擇。
        </h3>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          FAQ
        </h2>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">常見問題</h3>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 text-sm hover:bg-gray-50 transition-colors">
                {faq.q}
                <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                  ↓
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="mb-12 text-center py-10 border-t border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          準備好了嗎？
        </p>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
          選你最需要的那一款
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {PRODUCTS.map((p) => (
            <AffiliateButton key={p.rank} href={p.href} productName={p.name} className="w-full sm:w-auto">
              #{p.rank} {p.name.split(" ").slice(0, 2).join(" ")} →
            </AffiliateButton>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          本頁部分連結為聯盟行銷連結，購買時不影響你的售價。
        </p>
      </section>

      {/* ── 延伸閱讀 ───────────────────────────────────────── */}
      <section className="mb-12 pt-8 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          延伸閱讀
        </p>
        <Link
          href="/five-power-bank-guide"
          className="
            flex items-start gap-4 p-4
            rounded-xl border border-gray-200 bg-white
            shadow-[0_1px_4px_rgba(0,0,0,0.05)]
            hover:shadow-md hover:-translate-y-0.5
            transition-all duration-150 group
          "
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-sm leading-snug mb-0.5">
              2026 行動電源推薦｜不是越大越好！5大類型完整解析
            </p>
            <p className="text-xs text-gray-400 line-clamp-1">
              依出國、通勤、磁吸、輕薄、高 CP 值等 5 種使用情境分類挑選，不限 iPhone。
            </p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-sm mt-0.5 shrink-0">→</span>
        </Link>
      </section>

      {/* ── Disclosure ─────────────────────────────────────── */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-400 leading-relaxed mb-10">
        <strong className="text-gray-500">Affiliate Disclosure：</strong>
        本頁包含聯盟行銷連結。當你透過這些連結購買商品時，我們可能獲得少量佣金，
        但不會增加你的購買成本，也不影響我們的評測立場。我們只推薦真正認為值得的產品。
      </div>

      {/* ── Footer nav ─────────────────────────────────────── */}
      <footer className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          首頁
        </Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">
          文章
        </Link>
        <Link href="/about" className="hover:text-gray-700 transition-colors">
          關於我們
        </Link>
        <Link
          href="/privacy-policy"
          className="hover:text-gray-700 transition-colors"
        >
          隱私權政策
        </Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>
    </div>
  );
}
