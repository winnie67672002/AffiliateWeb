import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface AffiliateItem {
  id: string
  name: string
  description: string
  href: string
  badge?: string
  badgeVariant?: 'best' | 'editor' | 'recommended' | 'top' | 'sale'
  price?: string
  image?: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface HowToStepItem {
  name: string
  text: string
}

export interface ComparisonTableSpec {
  columns: { label: string; key: string }[]
  rows: { label: string; values: Record<string, string> }[]
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  category: string
  tags?: string[]
  coverImage?: string
  affiliate?: AffiliateItem[]
  /** 是否顯示在網站上，預設為 true（未設定時視為已發佈） */
  published?: boolean
  /** SEO：長尾關鍵字，用於 <meta name="keywords"> */
  keywords?: string[]
  /** 若此文章與其他頁面內容重複，覆寫 canonical 指向的主版本 */
  canonical?: string
  /** FAQ（用於 FAQPage schema，須與畫面上顯示的內容一致） */
  faqs?: FaqItem[]
  /** true 表示文章內文已經用 Markdown 寫了對應的 FAQ 區塊，頁面不需要再額外渲染一次 */
  faqRenderedInBody?: boolean
  /** HowTo 步驟（用於購買指南／教學類文章的 HowTo schema） */
  howTo?: {
    name: string
    description?: string
    steps: HowToStepItem[]
  }
  /** 比較表（用於文章內文尚未有 markdown table 的多產品比較文章） */
  comparisonTable?: ComparisonTableSpec
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface Post extends PostMeta {
  content: string
}

interface QueryOptions {
  /** 是否包含已關閉（隱藏）的文章，預設 false */
  includeUnpublished?: boolean
}

function ensureDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostFrontmatter
  // 未設定 published 時，視為已發佈（保持既有文章的預設行為）
  const published = frontmatter.published !== false

  return { slug, ...frontmatter, published, content }
}

export function getAllPosts(options: QueryOptions = {}): PostMeta[] {
  ensureDirectory()
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = fileNames.map((fileName) => {
    const { content: _content, ...meta } = readPostFile(fileName)
    return meta
  })

  const filtered = options.includeUnpublished ? posts : posts.filter((p) => p.published)

  return filtered.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string, options: QueryOptions = {}): Promise<Post | null> {
  ensureDirectory()
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const post = readPostFile(`${slug}.md`)

  if (!post.published && !options.includeUnpublished) return null

  return post
}

export function getAllSlugs(options: QueryOptions = {}): string[] {
  return getAllPosts(options).map((p) => p.slug)
}

//內部連結系統
export function getRelatedPosts(currentSlug: string, category: string) {
  const posts = getAllPosts()

  return posts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, 3)
}

/**
 * 切換／設定文章的顯示狀態（開啟或關閉）。
 * 直接修改 .md 檔的 frontmatter，只更新（或新增）published 這一行，
 * 其餘內容原封不動，避免重新序列化整份 YAML 造成格式跑掉。
 */
export function setPostPublished(slug: string, published: boolean): boolean {
  ensureDirectory()
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return false

  const raw = fs.readFileSync(fullPath, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return false

  const frontmatterBlock = match[1]
  const publishedLine = `published: ${published}`

  const newFrontmatterBlock = /^published:.*$/m.test(frontmatterBlock)
    ? frontmatterBlock.replace(/^published:.*$/m, publishedLine)
    : `${frontmatterBlock}\n${publishedLine}`

  const newRaw = raw.replace(match[0], `---\n${newFrontmatterBlock}\n---`)
  fs.writeFileSync(fullPath, newRaw, 'utf8')
  return true
}
