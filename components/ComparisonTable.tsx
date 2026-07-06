import type { ComparisonTableSpec } from '@/lib/posts'

/**
 * Lightweight comparison table for blog posts that recommend multiple
 * products but don't already have a Markdown table in the article body.
 */
export default function ComparisonTable({ table, title }: { table: ComparisonTableSpec; title?: string }) {
  if (!table || table.rows.length === 0) return null

  return (
    <section className="my-8 not-prose">
      {title && <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</p>}
      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  款式
                </th>
                {table.columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">{row.label}</td>
                  {table.columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-xs text-gray-600">
                      {row.values[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
