<Layout {locale}>
    {#if is_ready}
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
        {:else}
            <p class="text-center">TODO route: {page}</p>
        {/if}
    {:else}
        <p class="text-center">Loading...</p>
    {/if}
</Layout>

<script lang="ts">
import AboutPage from '$lib/components/AboutPage.svelte'
import BlogIndexPage from '$lib/components/BlogIndexPage.svelte'
import BlogPostPage from '$lib/components/BlogPostPage.svelte'
import HomePage from '$lib/components/HomePage.svelte'
import Layout from '$lib/components/Layout.svelte'
import ProjectsPage from '$lib/components/ProjectsPage.svelte'
import {locale_from_path} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const props = $props<{
    route?: {path: string; name: string; slug?: string}
    locale?: string
}>()

const is_browser = typeof window !== 'undefined'
const client_route = is_browser ? router.route : null

const pathname = $derived(props.route?.path ?? $client_route?.url?.pathname ?? '/')
const segments = $derived(pathname.split('/').filter(Boolean))
const locale = $derived(props.locale ?? locale_from_path(pathname))
const section = $derived(segments[1] ?? '')

const page = $derived.by(() => {
    if (props.route?.name) {
        const name = props.route.name
        if (name === 'blog-post') return 'blog-post'
        if (name === 'blog-index') return 'blog-index'
        return name
    }

    if (!section) return 'home'
    if (section === 'blog') return segments[2] ? 'blog-post' : 'blog-index'
    return section
})

const blog_slug = $derived(props.route?.slug ?? segments[2] ?? '')

const is_ready = $derived(props.route || $client_route?.url)
</script>
