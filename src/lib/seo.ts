import manifest from '$lib/data/route-manifest.json'

const ROUTE_LABELS: Record<string, string> = {
    projects: 'Projects',
    about: 'About',
    'blog-index': 'Blog',
}

interface Route {
    name: string
    path: string
    locale: string
    slug?: string
    data?: {
        post?: {
            frontmatter?: {
                ogTitle?: string
                title?: string
                description?: string
            }
        }
    }
}

interface SEO {
    title: string
    description: string
    canonical: string
    alternates: Array<{locale: string; href: string}>
    og: {
        title: string
        description: string
        url: string
        locale: string
        type: string
        image: string | null
    }
    twitter: {
        card: string
        title: string
        description: string
        image: string | null
    }
}

export function build_seo(route: Route, origin: string = 'https://example.com'): SEO {
    const base_title = 'Ahmed Osama – Portfolio'
    const is_blog_post = route.name === 'blog-post'

    const route_label = is_blog_post
        ? route.data?.post?.frontmatter?.ogTitle || route.data?.post?.frontmatter?.title || 'Blog'
        : ROUTE_LABELS[route.name] || ''

    const title = route_label ? `${route_label} | ${base_title}` : base_title
    const description = route.data?.post?.frontmatter?.description || 'Personal portfolio and blog.'

    const canonical = new URL(route.path, origin).toString()
    const og_image =
        is_blog_post && route.slug
            ? new URL(`/og/${route.locale}/${route.slug}.png`, origin).toString()
            : null

    const locales = manifest.locales || []
    const alternates = locales
        .filter(locale => locale !== route.locale)
        .map(locale => {
            const alt_path = route.path.replace(/^\/[^/]+/, `/${locale}`)
            return {
                locale,
                href: new URL(alt_path, origin).toString(),
            }
        })

    const og = {
        title,
        description,
        url: canonical,
        locale: route.locale,
        type: is_blog_post ? 'article' : 'website',
        image: og_image,
    }

    const twitter = {
        card: is_blog_post ? 'summary_large_image' : 'summary',
        title,
        description,
        image: og_image,
    }

    return {title, description, canonical, alternates, og, twitter}
}

export function normalize_path(pathname: string): string {
    const trimmed = pathname.replace(/\/+$/, '')
    return trimmed || '/'
}
