// Type definitions for the route manifest

export type Locale = 'en' | 'ar'

export interface Heading {
    id: string
    text: string
    level: number
}

export interface BlogFrontmatter {
    title: string
    description: string
    createdAt: string
    tags: string[]
}

export interface BlogPost {
    id: string
    slug: string
    locale: Locale
    frontmatter: BlogFrontmatter
    html: string
    headings: Heading[]
    source_locale: Locale
    is_fallback: boolean
}

export interface RouteManifest {
    locales: Locale[]
    routes: RouteEntry[]
    blogPosts: BlogPost[]
    projects: unknown[] // Projects are defined in projects.ts to avoid circular dependency
}

interface RouteEntry {
    id: string
    locale: Locale
    type: string
    name: string
    path: string
    data: Record<string, any>
}
