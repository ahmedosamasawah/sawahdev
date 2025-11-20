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
            {#each posts as post (post.id)}
                <li class="border-border bg-card rounded-lg border p-4 text-left">
                    <a href={`/${locale}/blog/${post.slug}`} class="block space-y-1">
                        <h3 class="text-base font-semibold">
                            {post.frontmatter?.title}
                        </h3>
                        {#if post.frontmatter?.description}
                            <p class="text-muted-foreground text-sm">
                                {post.frontmatter.description}
                            </p>
                        {/if}
                        {#if post.frontmatter?.createdAt}
                            <p class="text-muted-foreground text-xs">
                                {post.frontmatter.createdAt}
                            </p>
                        {/if}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</section>

<script>
import manifest from '$lib/data/route-manifest.json'
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()

const posts = $derived(
    manifest.blogPosts
        .filter(post => post.locale === locale)
        .sort((a, b) =>
            (b.frontmatter?.createdAt ?? '').localeCompare(a.frontmatter?.createdAt ?? ''),
        ),
)
</script>
