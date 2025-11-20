<section class="w-full max-w-2xl space-y-6">
    <header class="space-y-2 text-center md:text-left">
        <h2 class="text-2xl font-semibold">
            {translate(locale, 'blog.title')}
        </h2>
        <p class="text-muted-foreground">
            {translate(locale, 'blog.subtitle')}
        </p>
    </header>

    {#if posts.length === 0}
        <p class="text-muted-foreground text-center text-sm md:text-left">
            {translate(locale, 'blog.noPosts')}
        </p>
    {:else}
        <ul class="space-y-4">
            {#each posts as post (post.slug)}
                <li>
                    <PostCard {locale} {post} />
                </li>
            {/each}
        </ul>
    {/if}
</section>

<script>
import PostCard from '$lib/components/PostCard.svelte'
import manifest from '$lib/data/route-manifest.json'
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()

const posts = $derived(
    manifest.blogPosts
        .filter(p => p.locale === locale)
        .sort((a, b) => b.frontmatter.createdAt.localeCompare(a.frontmatter.createdAt)),
)
</script>
