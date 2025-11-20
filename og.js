import fs from 'node:fs/promises'
import path from 'node:path'

import { render as svelte_render } from 'svelte/server'
import { createServer } from 'vite'

import { dist_dir, file_exists, root_dir } from './fs-utils.js'

function build_og_html(body, locale) {
  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8">
    <style>
      html, body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

async function generate_og_images(manifest) {
  const blog_routes = manifest.routes.filter((r) => r.type === 'blog-post')
  if (blog_routes.length === 0) return

  const og_component_path = path.join(root_dir, 'src', 'Og.svelte')
  if (!(await file_exists(og_component_path))) return

  let chromium
  try {
    const mod = await import('playwright')
    chromium = mod.chromium
  } catch {
    chromium = null
  }

  const placeholder_png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
    'base64',
  )

  const vite_server = await createServer({
    configFile: path.join(root_dir, 'vite.config.ts'),
    server: { middlewareMode: true },
    logLevel: 'error',
  })

  try {
    const og_module = await vite_server.ssrLoadModule('/src/Og.svelte')
    const Og = og_module.default

    let browser = null
    let page = null

    if (chromium) {
      try {
        browser = await chromium.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        page = await browser.newPage()
        await page.setViewportSize({ width: 1200, height: 630 })
      } catch (error) {
        console.warn('playwright launch failed, writing placeholder OG images', error)
      }
    }

    for (const route of blog_routes) {
      const { post, is_fallback } = route.data

      const { body } = svelte_render(Og, {
        props: {
          title:
            post.frontmatter.ogTitle ||
            post.frontmatter.title,
          subtitle:
            post.frontmatter.ogDescription ||
            post.frontmatter.description,
          locale: route.locale,
          tags: post.frontmatter.tags,
          date: post.frontmatter.createdAt,
          is_fallback,
        },
      })

      const html = build_og_html(body, route.locale)

      const og_dir = path.join(dist_dir, 'og', route.locale)
      await fs.mkdir(og_dir, { recursive: true })

      const file_path = path.join(og_dir, `${route.slug}.png`)

      if (page) {
        try {
          await page.setContent(html, { waitUntil: 'networkidle' })
          await page.screenshot({ path: file_path })
        } catch (error) {
          console.warn('playwright screenshot failed, writing placeholder', error)
          await fs.writeFile(file_path, placeholder_png)
        }
      } else {
        await fs.writeFile(file_path, placeholder_png)
      }
    }

    if (browser) await browser.close()
  } finally {
    await vite_server.close()
  }
}

export { generate_og_images }
