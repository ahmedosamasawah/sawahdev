<div class="w-full max-w-2xl space-y-12">
    <section class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {translate(locale, 'blog.title')}
        </h1>
        <p class="text-muted-foreground leading-relaxed">
            {translate(locale, 'blog.subtitle')}
        </p>
        <a
            href="{base_url}{locale}"
            class="hover:text-foreground text-muted-foreground block text-sm underline decoration-dotted underline-offset-4"
        >
            {translate(locale, 'common.backArrow')}
            {translate(locale, 'common.nav.home')}
        </a>
    </section>

    {#if posts.length === 0}
        <p class="text-muted-foreground text-sm">
            {translate(locale, 'blog.noPosts')}
        </p>
    {:else}
        <section class="space-y-4">
            {#each posts as post (post.slug)}
                <PostCard {post} {locale} />
            {/each}
        </section>
    {/if}
</div>

<script lang="ts">
import PostCard from '$lib/components/PostCard.svelte'
import manifest from '$lib/data/route-manifest.json'
import {base_url, type Locale, translate} from '$lib/i18n/runtime'

const {locale} = $props<{locale: Locale}>()

const posts = $derived(
    manifest.blogPosts
        .filter(p => p.locale === locale)
        .sort((a, b) => b.frontmatter.createdAt.localeCompare(a.frontmatter.createdAt)),
)
</script>
