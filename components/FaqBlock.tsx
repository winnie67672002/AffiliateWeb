import type { FaqItem } from '@/lib/posts'

/**
 * Visual FAQ block for blog posts whose frontmatter FAQs are not already
 * written out as Markdown in the article body. Keep the visible copy here
 * in sync with the `faqs` array passed in — it also powers FAQPage schema.
 */
export default function FaqBlock({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 not-prose">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">FAQ</p>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">常見問題</h2>
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
  )
}
