import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { root_dir, file_exists } from './fs-utils.js'
import { locales } from './manifest.js'

const blog_dir = path.join(root_dir, 'content', 'blog')

function parse_blog_filename(filename) {
  const without_ext = filename.replace(/\.md$/i, '')
  const parts = without_ext.split('.')
  const locale = parts.pop()
  const slug = parts.join('.')
  return { slug, locale }
}

function slugify_heading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extract_headings(markdown) {
  const lines = markdown.split('\n')
  const headings = []

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!match) continue

    const level = match[1].length
    const text = match[2].trim()
    const id = slugify_heading(text)

    headings.push({ id, text, level })
  }

  return headings
}

async function load_blog_posts() {
  if (!(await file_exists(blog_dir))) return []

  const entries = await fs.readdir(blog_dir)
  const posts = []

  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue

    const { slug, locale } = parse_blog_filename(entry)
    if (!slug || !locale || !locales.includes(locale)) continue

    const file_path = path.join(blog_dir, entry)
    const raw = await fs.readFile(file_path, 'utf8')
    const parsed = matter(raw)
    const html = marked(parsed.content)
    const headings = extract_headings(parsed.content)
    const id = parsed.data.id || `${slug}-${locale}`

    posts.push({
      id,
      slug,
      locale,
      frontmatter: parsed.data || {},
      html,
      headings,
    })
  }

  return posts
}

export { parse_blog_filename, extract_headings, load_blog_posts }

