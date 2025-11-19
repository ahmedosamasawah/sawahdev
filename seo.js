import { locales } from './manifest.js'

const site_url_env = process.env.SITE_URL

if (!site_url_env) {
  console.warn('SITE_URL is not set; using https://example.com for SEO URLs')
}

const site_url = site_url_env || 'https://example.com'

function build_seo(route) {
  const base_title = 'Ahmed Osama – Portfolio'

  let route_label = ''
  if (route.name === 'projects') route_label = 'Projects'
  if (route.name === 'about') route_label = 'About'
  if (route.name === 'blog-index') route_label = 'Blog'
  if (route.name === 'blog-post') {
    route_label =
      route.data?.post?.frontmatter?.ogTitle ||
      route.data?.post?.frontmatter?.title ||
      'Blog'
  }

  const title = route_label
    ? `${route_label} | ${base_title}`
    : base_title

  const description =
    route.data?.post?.frontmatter?.description ||
    'Personal portfolio and blog.'

  const canonical = new URL(route.path, site_url).toString()

  const alternates = locales
    .filter((locale) => locale !== route.locale)
    .map((locale) => {
      const alt_path = route.path.replace(/^\/[^/]+/, `/${locale}`)
      return {
        locale,
        href: new URL(alt_path, site_url).toString(),
      }
    })

  return { title, description, canonical, alternates }
}

export { site_url, build_seo }
