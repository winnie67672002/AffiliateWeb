export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
      <p className="text-sm text-gray-400">載入中…</p>
    </div>
  )
}
