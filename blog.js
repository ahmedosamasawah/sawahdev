import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import { marked } from 'marked'

import { file_exists,root_dir } from './fs-utils.js'
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

const renderer = new marked.Renderer()
renderer.heading = function ({text, depth}) {
  const plain = text.replace(/<[^>]+>/g, '')
  const id = slugify_heading(plain)
  return `<h${depth} id="${id}">${text}</h${depth}>`
}
marked.use({renderer})

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

    const {slug, locale} = parse_blog_filename(entry)
    if (!slug || !locales.includes(locale)) continue

    const file_path = path.join(blog_dir, entry)
    const raw = await fs.readFile(file_path, 'utf8')
    const {data: frontmatter, content} = matter(raw)
    const html = marked(content)
    const headings = extract_headings(content)
    const id = frontmatter.id || `${slug}-${locale}`

    posts.push({id, slug, locale, frontmatter, html, headings})
  }

  return posts
}

export { extract_headings, load_blog_posts,parse_blog_filename }
