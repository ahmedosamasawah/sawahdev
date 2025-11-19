import Navgo from 'navgo'
import { tick } from 'svelte'
import manifest_json from '$lib/data/route-manifest.json'

interface BlogPost {
  id: string
  slug: string
  locale: string
  frontmatter: Record<string, unknown>
  html: string
  headings: { id: string; text: string; level: number }[]
}

type RouteType = 'page' | 'blog-post' | 'blog-index'

interface Route {
  id: string
  locale: string
  type: RouteType
  name: string
  path: string
  slug?: string
  data: unknown
}

interface Manifest {
  locales: string[]
  routes: Route[]
  blogPosts: BlogPost[]
}

const manifest = manifest_json as Manifest

if (!manifest || !Array.isArray(manifest.routes) || manifest.routes.length === 0) {
  throw new Error('route-manifest.json is missing or has no routes')
}

const pattern_set = new Set<string>()

for (const route of manifest.routes) {
  if (!route || typeof route.path !== 'string') {
    throw new Error('invalid route in route-manifest.json')
  }

  const segments = route.path.split('/').filter(Boolean)
  if (!segments.length) {
    throw new Error(`invalid path in route-manifest.json: "${route.path}"`)
  }

  segments[0] = ':locale'

  if (route.type === 'blog-post' && segments.length > 2) {
    segments[segments.length - 1] = ':slug'
  }

  const pattern = '/' + segments.join('/')
  pattern_set.add(pattern)
}

const routes = Array.from(pattern_set).map((pattern) => [pattern, {}])

export const router = new Navgo(routes, {
  base: '/',
  tick,
  before_navigate() {},
  after_navigate() {},
})

router.init()
