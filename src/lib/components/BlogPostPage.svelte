{#if post}
    <article class="w-full max-w-2xl space-y-4 text-left">
        <header class="space-y-2">
            <h1 class="text-2xl font-semibold">
                {post.frontmatter?.title}
            </h1>
            {#if post.frontmatter?.createdAt}
                <p class="text-muted-foreground text-xs">
                    {post.frontmatter.createdAt}
                </p>
            {/if}
            {#if post.frontmatter?.description}
                <p class="text-muted-foreground text-sm">
                    {post.frontmatter.description}
                </p>
            {/if}
        </header>

        <div class="prose prose-sm dark:prose-invert max-w-none">
            {@html post.html}
        </div>
    </article>
{:else}
    <p class="text-muted-foreground text-sm">
        {translate(locale, 'blog.postNotFound')}
    </p>
{/if}

<script>
import manifest from '$lib/data/route-manifest.json'
import {translate} from '$lib/i18n/runtime'

const {locale, slug} = $props()

const post = $derived(
    manifest.blogPosts.find(entry => entry.locale === locale && entry.slug === slug),
)
</script>
