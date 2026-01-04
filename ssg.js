import fs from 'node:fs/promises'
import path from 'node:path'

import { render as svelte_render } from 'svelte/server'
import { createServer } from 'vite'

import { base_path, dist_dir, root_dir } from './fs-utils.js'
import { build_seo } from './seo.js'

function route_path_to_file(pathname) {
  const trimmed = pathname.replace(/\/+$/, '').replace(/^\/+/, '')
  const segments = trimmed ? trimmed.split('/') : []
  const dir = path.join(dist_dir, ...segments)
  return path.join(dir, 'index.html')
}

function escape_attr(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function build_html_document({ lang, dir, head, body, entry_js, css_hrefs }) {
  const css_links = css_hrefs
    .map((href) => `<link rel="stylesheet" href="${escape_attr(href)}">`)
    .join('\n    ')

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${head}
    ${css_links}
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
      })

      const file_path = route_path_to_file(route.path)
      await fs.mkdir(path.dirname(file_path), { recursive: true })
      await fs.writeFile(file_path, html, 'utf8')
    }

    const default_locale = manifest.locales?.[0] || 'en'

    const clean_base = base_path.endsWith('/') ? base_path : `${base_path}/`
    const redirect_url = `${clean_base}${default_locale}/`

    const root_redirect = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${redirect_url}">
    <link rel="canonical" href="${redirect_url}">
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
