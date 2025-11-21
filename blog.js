import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import {marked} from 'marked'
import {codeToHtml} from 'shiki'

import {file_exists, root_dir} from './fs-utils.js'
import {locales} from './manifest.js'

const blog_dir = path.join(root_dir, 'content', 'blog')

function parse_blog_filename(filename) {
  const without_ext = filename.replace(/\.md$/i, '')
  const parts = without_ext.split('.')
  const locale = parts.pop()
  const slug = parts.join('.')
  return { slug, locale }
}

const callout_config = {
  info: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    bg_class: 'bg-emerald-50/80 dark:bg-emerald-950/20',
    border_class: 'border-emerald-500/50',
    icon_class: 'text-emerald-600 dark:text-emerald-400',
    text_class: 'text-emerald-900 dark:text-emerald-50'
  },
  tip: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
    bg_class: 'bg-sky-50/80 dark:bg-sky-950/20',
    border_class: 'border-sky-500/50',
    icon_class: 'text-sky-600 dark:text-sky-400',
    text_class: 'text-sky-900 dark:text-sky-50'
  },
  warning: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    bg_class: 'bg-amber-50/80 dark:bg-amber-950/20',
    border_class: 'border-amber-500/50',
    icon_class: 'text-amber-600 dark:text-amber-400',
    text_class: 'text-amber-900 dark:text-amber-50'
  },
  danger: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    bg_class: 'bg-red-50/80 dark:bg-red-950/20',
    border_class: 'border-red-500/50',
    icon_class: 'text-red-600 dark:text-red-400',
    text_class: 'text-red-900 dark:text-red-50'
  }
}

// Custom marked extension for callouts
const callout_extension = {
  name: 'callout',
  level: 'block',
  start(src) {
    return src.match(/^:::(info|tip|warning|danger)/)?.index
  },
  tokenizer(src) {
    const rule = /^:::(info|tip|warning|danger)\s*\n([\s\S]*?)\n:::/
    const match = rule.exec(src)
    if (match) {
      return {
        type: 'callout',
        raw: match[0],
        callout_type: match[1],
        content: match[2].trim()
      }
    }
  },
  renderer(token) {
    const config = callout_config[token.callout_type] || callout_config.info
    const content = marked.parse(token.content, {async: false})

    return `<div class="callout ${config.bg_class} ${config.border_class} ${config.text_class} my-6 rounded-xl border-l-4 p-4 shadow-sm">
  <div style="display: flex; gap: 0.75rem;">
    <div style="flex-shrink: 0; padding-top: 0.125rem;">
      <div class="${config.icon_class}">${config.icon}</div>
    </div>
    <div class="callout-content" style="flex: 1; font-size: 0.9375rem; line-height: 1.6;">
      ${content}
    </div>
  </div>
</div>`
  }
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

marked.use({extensions: [callout_extension], renderer})

// Preprocess markdown to replace code blocks with highlighted HTML
async function preprocess_code_blocks(markdown) {
  const code_block_regex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks = []
  let match

  // Find all code blocks
  while ((match = code_block_regex.exec(markdown)) !== null) {
    blocks.push({
      original: match[0],
      lang: match[1] || 'text',
      code: match[2],
      index: match.index
    })
  }

  // Replace each block with Shiki-highlighted HTML
  let result = markdown
  for (const block of blocks.reverse()) { // Reverse to maintain indices
    try {
      const html = await codeToHtml(block.code, {
        lang: block.lang,
        theme: 'one-dark-pro', // VS Code's One Dark Pro theme
        cssVariablePrefix: '--shiki-',
      })
      result = result.substring(0, block.index) + html + result.substring(block.index + block.original.length)
    } catch (err) {
      console.error('Shiki error for lang:', block.lang, err.message)
      // Keep original code block on error
    }
  }

  return result
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

    const {slug, locale} = parse_blog_filename(entry)
    if (!slug || !locales.includes(locale)) continue

      const file_path = path.join(blog_dir, entry)
      const raw = await fs.readFile(file_path, 'utf8')
      const {data: frontmatter, content} = matter(raw)
      // Preprocess code blocks with Shiki before marked parsing
      const preprocessed = await preprocess_code_blocks(content)
      const html = await marked.parse(preprocessed)
      const headings = extract_headings(content)
      const id = frontmatter.id || `${slug}-${locale}`

    posts.push({id, slug, locale, frontmatter, html, headings})
  }

  return posts
}

export {extract_headings, load_blog_posts, parse_blog_filename}
