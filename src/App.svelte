<Layout {locale}>
    {#if $route.url}
        {#if page === 'home'}
            <HomePage {locale} />
        {:else if page === 'projects'}
            <ProjectsPage {locale} />
        {:else if page === 'about'}
            <AboutPage {locale} />
        {:else}
            <p class="text-center">TODO route: {page}</p>
        {/if}
    {:else}
        <p class="text-center">Loading...</p>
    {/if}
</Layout>

<script>
import AboutPage from '$lib/components/AboutPage.svelte'
import HomePage from '$lib/components/HomePage.svelte'
import Layout from '$lib/components/Layout.svelte'
import ProjectsPage from '$lib/components/ProjectsPage.svelte'
import {locale_from_path} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const route = router.route

const locale = $derived(locale_from_path($route.url?.pathname ?? '/'))

const page = $derived.by(() => {
    const pathname = $route.url?.pathname ?? '/'
    const segments = pathname.split('/').filter(Boolean)
    const section = segments[1]

    if (!section) return 'home'
    if (section === 'projects') return 'projects'
    if (section === 'about') return 'about'
    if (section === 'blog') return segments[2] ? 'blog-post' : 'blog-index'
    return 'home'
})
</script>
