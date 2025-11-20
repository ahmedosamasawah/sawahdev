import fs from 'node:fs/promises'
import path from 'node:path'

import { render as svelte_render } from 'svelte/server'
import { createServer } from 'vite'

import { dist_dir,root_dir } from './fs-utils.js'
import { build_seo } from './seo.js'

function route_path_to_file(pathname) {
  const trimmed = pathname.replace(/\/+$/, '').replace(/^\/+/, '')
  const segments = trimmed ? trimmed.split('/') : []
  const dir = path.join(dist_dir, ...segments)
  return path.join(dir, 'index.html')
}

function escape_html(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escape_attr(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function build_html_document({ lang, dir, head, body, entry_js, css_hrefs, seo }) {
  const title = escape_html(seo?.title || '')
  const description = escape_attr(seo?.description || '')
  const canonical = seo?.canonical ? escape_attr(seo.canonical) : ''
  const alternates = Array.isArray(seo?.alternates) ? seo.alternates : []
  const og = seo?.og || {}
  const twitter = seo?.twitter || {}

  const css_links = (css_hrefs || [])
    .map((href) => `<link rel="stylesheet" href="${escape_attr(href)}">`)
    .join('\n    ')

  const canonical_link = canonical ? `<link rel="canonical" href="${canonical}">` : ''
  const alternate_links = alternates
    .map((alt) => `<link rel="alternate" hreflang="${escape_attr(alt.locale)}" href="${escape_attr(alt.href)}">`)
    .join('\n    ')

  const og_tags = [
    og.title && `<meta property="og:title" content="${escape_attr(og.title)}">`,
    og.description && `<meta property="og:description" content="${escape_attr(og.description)}">`,
    og.url && `<meta property="og:url" content="${escape_attr(og.url)}">`,
    og.locale && `<meta property="og:locale" content="${escape_attr(og.locale)}">`,
    og.type && `<meta property="og:type" content="${escape_attr(og.type)}">`,
    og.image && `<meta property="og:image" content="${escape_attr(og.image)}">`,
  ].filter(Boolean)

  const twitter_tags = [
    twitter.card && `<meta name="twitter:card" content="${escape_attr(twitter.card)}">`,
    twitter.title && `<meta name="twitter:title" content="${escape_attr(twitter.title)}">`,
    twitter.description && `<meta name="twitter:description" content="${escape_attr(twitter.description)}">`,
    twitter.image && `<meta name="twitter:image" content="${escape_attr(twitter.image)}">`,
  ].filter(Boolean)

  const head_parts = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    title && `<title>${title}</title>`,
    description && `<meta name="description" content="${description}">`,
    canonical_link,
    alternate_links,
    head,
    css_links,
    ...og_tags,
    ...twitter_tags,
  ].filter(Boolean)

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
  <head>
    ${head_parts.join('\n    ')}
  </head>
  <body>
    <div id="app">${body}</div>
    ${entry_js ? `<script type="module" src="${escape_attr(entry_js)}"></script>` : ''}
  </body>
</html>
`
}

async function ssg_routes(manifest, i18n, assets) {
  const vite_server = await createServer({
    configFile: path.join(root_dir, 'vite.config.ts'),
    server: { middlewareMode: true },
    logLevel: 'error',
  })

  try {
    const app_module = await vite_server.ssrLoadModule('/src/App.svelte')
    const App = app_module.default

    for (const route of manifest.routes) {
      const locale = route.locale
      const meta = i18n.html_meta[locale] || { lang: locale, dir: 'ltr' }
      const seo = build_seo(route)

      const { body, head } = svelte_render(App, {
        props: {
          route: {
            id: route.id,
            path: route.path,
            name: route.name,
            type: route.type,
            slug: route.slug,
          },
          locale,
          data: route.data,
          seo,
        },
      })

      const html = build_html_document({
        lang: meta.lang,
        dir: meta.dir,
        head,
        body,
        entry_js: assets.entry_js,
        css_hrefs: assets.css,
        seo,
      })

      const file_path = route_path_to_file(route.path)
      await fs.mkdir(path.dirname(file_path), { recursive: true })
      await fs.writeFile(file_path, html, 'utf8')
    }

    const default_locale = manifest.locales?.[0] || 'en'
    const root_redirect = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=/${default_locale}/">
    <link rel="canonical" href="/${default_locale}/">
  </head>
  <body></body>
</html>
`

    await fs.writeFile(path.join(dist_dir, 'index.html'), root_redirect, 'utf8')
  } finally {
    await vite_server.close()
  }
}

export { ssg_routes }
