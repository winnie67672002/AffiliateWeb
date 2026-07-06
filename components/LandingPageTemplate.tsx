import Image from 'next/image'
import Link from 'next/link'
import type { LandingPage, LandingProduct } from '@/lib/landingPages'
import AffiliateButton from '@/components/AffiliateButton'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import ProductListSchema from '@/components/schema/ProductListSchema'

// ─── Sub-components (server-safe) ────────────────────────────────────────────

function ProConList({ items, type }: { items: string[]; type: 'pro' | 'con' }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
          <span className={`shrink-0 font-bold mt-0.5 ${type === 'pro' ? 'text-emerald-500' : 'text-rose-400'}`}>
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
    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-extrabold flex items-center justify-center shadow-md z-10">
      {rank}
    </div>
  )
}

function ProductCard({ product }: { product: LandingProduct }) {
  return (
    <div
      id={`pick-${product.rank}`}
      className={`relative rounded-2xl border-2 ${product.accentColor} bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden`}
    >
      <RankBadge rank={product.rank} />
      <div className={`h-1 w-full bg-gradient-to-r ${product.topBarColor}`} />

      <div className="p-6 sm:p-7">
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
            <span className={`text-[0.65rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${product.badgeColor}`}>
              {product.badge}
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mt-2 mb-1 leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400 italic">{product.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(product.specs)
                .filter(([, v]) => typeof v === 'string')
                .map(([k, v]) => (
                  <span key={k} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {String(v)}
                  </span>
                ))}
              {product.specs['magsafe'] === true && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  MagSafe ✓
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">優點</p>
            <ProConList items={product.pros} type="pro" />
          </div>
          <div className="bg-rose-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">缺點</p>
            <ProConList items={product.cons} type="con" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AffiliateButton href={product.href} productName={product.name} className="flex-1 sm:flex-none">
            {product.ctaText}
          </AffiliateButton>
          <span className="text-sm font-semibold text-gray-700">{product.price}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────

export default function LandingPageTemplate({ page }: { page: LandingPage }) {
  const { products, comparisonColumns, buyingGuide, useCases, midCta, faqs } = page

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '文章', url: '/blog' },
          { name: page.heroTitle, url: page.canonicalOverride ?? `/p/${page.slug}` },
        ]}
      />
      <FaqSchema faqs={faqs} />
      <ProductListSchema
        products={products.map((p) => ({
          name: p.name,
          description: p.description,
          image: p.image,
          url: p.href,
          price: p.price,
          position: p.rank,
        }))}
      />

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500 truncate max-w-[220px]">{page.heroTitle}</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full bg-white">
            {page.category}
          </span>
          <time className="text-sm text-gray-400">{page.updatedLabel}</time>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          {page.heroTitle}<br />
          <span className="text-gray-400 font-bold">{page.heroSubtitle}</span>
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4 mb-8">
          {page.heroDesc}
        </p>

        {/* Quick pick cards */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {products.map((p) => (
            <a
              key={p.rank}
              href={`#pick-${p.rank}`}
              className="flex flex-col gap-1 p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-150 no-underline"
            >
              <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full self-start ${p.badgeColor}`}>
                {p.badge}
              </span>
              <span className="text-sm font-semibold text-gray-900 leading-snug">{p.name}</span>
              <span className="text-xs text-gray-400">{p.price}</span>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <AffiliateButton href={products[0].href} productName={products[0].name}>
            查看 #1 推薦 →
          </AffiliateButton>
          <a
            href="#comparison"
            className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 no-underline"
          >
            比較所有規格 ↓
          </a>
        </div>
      </header>

      {/* ── Top Picks ──────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Top {products.length} 推薦
        </h2>
        <div className="space-y-10">
          {products.map((product) => (
            <ProductCard key={product.rank} product={product} />
          ))}
        </div>
      </section>

      {/* ── Comparison Table ───────────────────────────────── */}
      <section id="comparison" className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          規格比較表
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {products.length} 款產品完整規格對比，幫你快速找到最適合的選擇。
        </p>
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    規格
                  </th>
                  {products.map((p) => (
                    <th key={p.rank} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${p.badgeColor}`}>
                          #{p.rank}
                        </span>
                        <span className="font-semibold text-gray-900 text-xs leading-tight max-w-[90px]">
                          {p.name.split(' ').slice(0, 3).join(' ')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonColumns.map((col, i) => (
                  <tr key={col.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {col.label}
                    </td>
                    {products.map((p) => {
                      const val = p.specs[col.key]
                      return (
                        <td key={p.rank} className="px-4 py-3 text-center">
                          {typeof val === 'boolean' ? (
                            <span className={`font-bold text-base ${val ? 'text-emerald-500' : 'text-gray-300'}`}>
                              {val ? '✓' : '✗'}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-700">{String(val ?? '—')}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">購買</td>
                  {products.map((p) => (
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

      {/* ── Buying Guide ───────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          購買指南
        </h2>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{page.buyingGuideTitle}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{page.buyingGuideIntro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {buyingGuide.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1.5">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Use-case quick match */}
        <div className="rounded-2xl bg-gray-900 text-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">快速推薦對照</p>
          <div className="space-y-3">
            {useCases.map((item) => (
              <div
                key={item.use}
                className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0"
              >
                <div>
                  <span className="text-gray-400 text-xs">需求：</span>
                  <span className="text-white text-sm font-medium ml-1">{item.use}</span>
                </div>
                <AffiliateButton
                  href={item.href}
                  productName={item.pick}
                  className="!bg-white !text-gray-900 !text-xs !px-3 !py-1.5 !rounded-lg hover:!bg-gray-100 shrink-0"
                >
                  {item.pick} →
                </AffiliateButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page CTA ───────────────────────────────────── */}
      <section className="mb-16 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 sm:p-8 text-center">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">{midCta.label}</p>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">{midCta.productName}</h3>
        <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">{midCta.body}</p>
        <AffiliateButton href={midCta.href} productName={midCta.productName} className="mx-auto">
          {midCta.ctaText}
        </AffiliateButton>
        <p className="text-xs text-amber-600 mt-3">* 此為聯盟行銷連結，不影響你的購買價格</p>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">FAQ</h2>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">常見問題</h3>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 text-sm hover:bg-gray-50 transition-colors">
                {faq.q}
                <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">↓</span>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="mb-12 text-center py-10 border-t border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">準備好了嗎？</p>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">選你最需要的那一款</h3>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {products.map((p) => (
            <AffiliateButton key={p.rank} href={p.href} productName={p.name} className="w-full sm:w-auto">
              #{p.rank} {p.name.split(' ').slice(0, 2).join(' ')} →
            </AffiliateButton>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">本頁部分連結為聯盟行銷連結，購買時不影響你的售價。</p>
      </section>

      {/* ── Disclosure ─────────────────────────────────────── */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-400 leading-relaxed mb-10">
        <strong className="text-gray-500">Affiliate Disclosure：</strong>
        本頁包含聯盟行銷連結。當你透過這些連結購買商品時，我們可能獲得少量佣金，
        但不會增加你的購買成本，也不影響我們的評測立場。
      </div>

      {/* ── Footer nav ─────────────────────────────────────── */}
      <footer className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <Link href="/about" className="hover:text-gray-700 transition-colors">關於我們</Link>
        <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">隱私權政策</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>

    </div>
  )
}
