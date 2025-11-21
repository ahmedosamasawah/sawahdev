<div class="w-full max-w-2xl space-y-12">
    <section class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {translate(locale, 'blog.title')}
        </h1>
        <p class="text-muted-foreground leading-relaxed">
            {translate(locale, 'blog.subtitle')}
        </p>
        <a
            href="/{locale}"
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
                <div class="space-y-1">
                    <a
                        href="/{locale}/blog/{post.slug}"
                        class="hover:text-foreground block text-base underline decoration-dotted underline-offset-4"
                    >
                        {post.frontmatter.title}
                    </a>
                    <time class="text-muted-foreground block text-xs">
                        {format_date(locale, post.frontmatter.createdAt)}
                    </time>
                </div>
            {/each}
        </section>
    {/if}
</div>

<script>
import manifest from '$lib/data/route-manifest.json'
import {format_date, translate} from '$lib/i18n/runtime'

const {locale} = $props()

const posts = $derived(
    manifest.blogPosts
        .filter(p => p.locale === locale)
        .sort((a, b) => b.frontmatter.createdAt.localeCompare(a.frontmatter.createdAt)),
)
</script>
