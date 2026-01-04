<svelte:head>
    {#if seo}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        {#each seo.alternates as alt}
            <link rel="alternate" hreflang={alt.locale} href={alt.href} />
        {/each}
        <meta property="og:title" content={seo.og.title} />
        <meta property="og:description" content={seo.og.description} />
        <meta property="og:url" content={seo.og.url} />
        <meta property="og:locale" content={seo.og.locale} />
        <meta property="og:type" content={seo.og.type} />
        {#if seo.og.image}
            <meta property="og:image" content={seo.og.image} />
        {/if}
        <meta name="twitter:card" content={seo.twitter.card} />
        <meta name="twitter:title" content={seo.twitter.title} />
        <meta name="twitter:description" content={seo.twitter.description} />
        {#if seo.twitter.image}
            <meta name="twitter:image" content={seo.twitter.image} />
        {/if}
    {/if}
</svelte:head>

<Layout {locale}>
    {#if page === 'home'}
        <HomePage {locale} />
    {:else if page === 'projects'}
        <ProjectsPage {locale} />
    {:else if page === 'about'}
        <AboutPage {locale} />
    {:else if page === 'blog-index'}
        <BlogIndexPage {locale} />
    {:else if page === 'blog-post'}
        <BlogPostPage {locale} slug={blog_slug} />
    {:else if page === 'project-detail'}
        <ProjectPage {locale} projectId={project_id} />
    {:else}
        <p class="text-center">TODO route: {page}</p>
    {/if}
</Layout>

<script lang="ts">
import AboutPage from '$lib/components/AboutPage.svelte'
import BlogIndexPage from '$lib/components/BlogIndexPage.svelte'
import BlogPostPage from '$lib/components/BlogPostPage.svelte'
import HomePage from '$lib/components/HomePage.svelte'
import Layout from '$lib/components/Layout.svelte'
import ProjectPage from '$lib/components/ProjectPage.svelte'
import ProjectsPage from '$lib/components/ProjectsPage.svelte'
import {locale_from_path} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const props = $props<{
    route?: {path: string; name: string; slug?: string; projectId?: string}
    locale?: string
    data?: any
    seo?: any
}>()

const is_browser = typeof window !== 'undefined'
const client_route = is_browser ? router.route : null
const raw_pathname = $derived(props.route?.path ?? $client_route?.url.pathname ?? '/')
const pathname = $derived(
    raw_pathname.startsWith('/sawahdev/')
        ? raw_pathname.slice('/sawahdev'.length) || '/'
        : raw_pathname,
)
const segments = $derived(pathname.split('/').filter(Boolean))
const locale = $derived(props.locale ?? locale_from_path(pathname))
const section = $derived(segments[1] ?? '')

const page = $derived.by(() => {
    if (props.route?.name) return props.route.name
    if (!section) return 'home'
    if (section === 'blog') return segments[2] ? 'blog-post' : 'blog-index'
    if (section === 'projects' && segments[2]) return 'project-detail'
    return section
})

const blog_slug = $derived(props.route?.slug ?? segments[2] ?? '')
const project_id = $derived(props.route?.projectId ?? segments[2] ?? '')
const seo = $derived(props.seo)

$effect(() => {
    if (is_browser) {
        document.documentElement.lang = locale
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    }
})
</script>
