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

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  category: string
  tags?: string[]
  coverImage?: string
  affiliate?: AffiliateItem[]
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface Post extends PostMeta {
  content: string
}

function ensureDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

export function getAllPosts(): PostMeta[] {
  ensureDirectory()
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    return { slug, ...(data as PostFrontmatter) }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDirectory()
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { slug, ...(data as PostFrontmatter), content }
}

export function getAllSlugs(): string[] {
  ensureDirectory()
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

//內部連結系統
export function getRelatedPosts(currentSlug: string, category: string) {
  const posts = getAllPosts()

  return posts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, 3)
}
