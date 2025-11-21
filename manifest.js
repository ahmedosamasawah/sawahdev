import fs from 'node:fs/promises'
import path from 'node:path'

import { root_dir } from './fs-utils.js'
import { projects } from './src/lib/data/projects.js'

const locales = ['en', 'ar']
const static_pages = ['home', 'projects', 'about']

function build_manifest(blog_posts) {
  const routes = []
  const blog_by_slug = new Map()

  for (const post of blog_posts) {
    const entry = blog_by_slug.get(post.slug) || {}
    entry[post.locale] = post
    blog_by_slug.set(post.slug, entry)
  }

  const blog_posts_with_fallbacks = []

  for (const locale of locales) {
    for (const page of static_pages) {
      const path_suffix = page === 'home' ? '' : `/${page}`

      routes.push({
        id: `${page}-${locale}`,
        locale,
        type: 'page',
        name: page,
        path: `/${locale}${path_suffix}`,
        data: {},
      })
    }
  }

  for (const [slug, by_locale] of blog_by_slug) {
    const available_locales = Object.keys(by_locale)
    const default_locale = available_locales.includes('en') ? 'en' : available_locales[0]

    for (const locale of locales) {
      const source_post = by_locale[locale] || by_locale[default_locale]

      if (!source_post) throw new Error(`Missing blog post "${slug}" and no fallback available`)

      const is_fallback = !by_locale[locale]
      const post = {
        ...source_post,
        locale,
        source_locale: source_post.locale,
        is_fallback,
      }

      routes.push({
        id: `blog-${slug}-${locale}`,
        locale,
        type: 'blog-post',
        name: 'blog-post',
        path: `/${locale}/blog/${slug}`,
        slug,
        data: {
          post,
          is_fallback,
          available_locales,
          default_locale,
        },
      })

      blog_posts_with_fallbacks.push(post)
    }
  }

  for (const locale of locales) {
    const posts_for_locale = blog_posts_with_fallbacks.filter((p) => p.locale === locale)

    routes.push({
      id: `blog-index-${locale}`,
      locale,
      type: 'blog-index',
      name: 'blog-index',
      path: `/${locale}/blog`,
      data: {
        posts: posts_for_locale.map((post) => ({
          slug: post.slug,
          locale,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          createdAt: post.frontmatter.createdAt,
          tags: post.frontmatter.tags,
          is_fallback: post.is_fallback,
          source_locale: post.source_locale,
        })),
      },
    })
  }

  // Add project detail page routes
  for (const project of projects) {
    if (project.hasDetailPage) {
      for (const locale of locales) {
        routes.push({
          id: `project-${project.id}-${locale}`,
          locale,
          type: 'project-detail',
          name: 'project-detail',
          path: `/${locale}/projects/${project.id}`,
          projectId: project.id,
          data: {
            project,
          },
        })
      }
    }
  }

  return {
    locales,
    routes,
    blogPosts: blog_posts_with_fallbacks,
    projects,
  }
}

async function write_manifest(manifest) {
  const out_path = path.join(root_dir, 'src', 'lib', 'data', 'route-manifest.json')
  const json = JSON.stringify(manifest, null, 2)
  await fs.writeFile(out_path, json, 'utf8')
}

export { build_manifest, locales, write_manifest }
