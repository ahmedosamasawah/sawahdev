{#if post}
    <div class="flex w-full max-w-4xl gap-6 rtl:flex-row-reverse">
        <article class="blog-article flex-1 space-y-4" lang={article_lang}>
            <header>
                <a
                    href="/{locale}/blog"
                    class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-xs"
                >
                    <ArrowLeft class="h-3 w-3 rtl:rotate-180" />
                    <span>{translate(locale, 'blog.title')}</span>
                </a>

                <div class="space-y-1">
                    <h1 class="text-2xl font-semibold">
                        {post.frontmatter.title}
                    </h1>
                    {#if formatted_date}
                        <p class="text-muted-foreground text-xs">
                            {formatted_date}
                        </p>
                    {/if}
                </div>

                {#if post.frontmatter.description}
                    <p class="text-muted-foreground text-sm">
                        {post.frontmatter.description}
                    </p>
                {/if}
            </header>

            {#if post.is_fallback}
                <p class="bg-muted text-muted-foreground rounded-md px-3 py-2 text-xs">
                    {translate(locale, 'blog.fallbackNotice')}
                </p>
            {/if}

            <div class="prose prose-sm dark:prose-invert max-w-none">
                {@html post.html}
            </div>
        </article>

        <PostToc headings={post.headings} {locale} />
    </div>
{:else}
    <p class="text-muted-foreground text-sm">
        {translate(locale, 'blog.postNotFound')}
    </p>
{/if}

<script>
import {ArrowLeft} from '@lucide/svelte'

import PostToc from '$lib/components/PostToc.svelte'
import manifest from '$lib/data/route-manifest.json'
import {format_date, translate} from '$lib/i18n/runtime'

const {locale, slug} = $props()

const post = $derived(manifest.blogPosts.find(p => p.locale === locale && p.slug === slug))
const formatted_date = $derived(post && format_date(locale, post.frontmatter.createdAt))
const article_lang = $derived(post?.is_fallback ? post.source_locale : locale)
</script>
