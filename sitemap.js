import fs from 'node:fs/promises'
import path from 'node:path'
import { dist_dir } from './fs-utils.js'
import { site_url } from './seo.js'

async function generate_sitemap_and_robots(manifest) {
  const urls = new Set()

  for (const route of manifest.routes) {
    urls.add(new URL(route.path, site_url).toString())
  }

  const lastmod = new Date().toISOString().split('T')[0]

  const sitemap_items = Array.from(urls)
    .sort()
    .map(
      (loc) => `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
    )
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap_items}
</urlset>
`

  const robots = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site_url).toString()}
`

  await fs.writeFile(path.join(dist_dir, 'sitemap.xml'), sitemap, 'utf8')
  await fs.writeFile(path.join(dist_dir, 'robots.txt'), robots, 'utf8')
}

export { generate_sitemap_and_robots }

