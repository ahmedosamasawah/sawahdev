import fs from 'node:fs/promises'
import path from 'node:path'
import { root_dir } from './fs-utils.js'

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

    const posts_for_locale = []

    for (const [slug, by_locale] of blog_by_slug) {
      const post = by_locale[locale]

      if (!post) {
        throw new Error(`Missing blog post "${slug}" for locale "${locale}"`)
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
        },
      })

      posts_for_locale.push(post)
    }

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
        })),
      },
    })
  }

  return {
    locales,
    routes,
    blogPosts: blog_posts,
  }
}

async function write_manifest(manifest) {
  const out_path = path.join(root_dir, 'src', 'lib', 'data', 'route-manifest.json')
  const json = JSON.stringify(manifest, null, 2)
  await fs.writeFile(out_path, json, 'utf8')
}

export { locales, build_manifest, write_manifest }
