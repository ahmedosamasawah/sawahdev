{#if post}
    <!-- Two-column layout container -->
    <div class="mx-auto w-full max-w-screen-xl px-6 lg:flex lg:justify-between lg:gap-8 lg:px-24">
        <!-- Left sidebar: Sticky TOC -->
        {#if post.headings.length}
            <div
                class="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-start lg:py-24"
            >
                <div class="hidden lg:block">
                    <a
                        href="/{locale}/blog"
                        class="hover:text-foreground text-muted-foreground mb-8 block text-sm underline decoration-dotted underline-offset-4"
                    >
                        {translate(locale, 'common.backArrow')}
                        {translate(locale, 'blog.title')}
                    </a>
                    <PostToc headings={post.headings} {locale} />
                </div>
            </div>
        {/if}

        <!-- Right content area -->
        <main class="pt-12 lg:w-[52%] lg:py-24">
            <div class="mb-8 lg:hidden">
                <a
                    href="/{locale}/blog"
                    class="hover:text-foreground text-muted-foreground block text-sm underline decoration-dotted underline-offset-4"
                >
                    {translate(locale, 'common.backArrow')}
                    {translate(locale, 'blog.title')}
                </a>
            </div>

            <header class="mb-8 space-y-4">
                <div class="space-y-2">
                    <h1 class="text-2xl font-semibold">
                        {post.frontmatter.title}
                    </h1>
                    {#if formatted_date}
                        <time class="text-muted-foreground block text-xs">
                            {formatted_date}
                        </time>
                    {/if}
                </div>

                {#if post.frontmatter.description}
                    <p class="text-muted-foreground leading-relaxed">
                        {post.frontmatter.description}
                    </p>
                {/if}
            </header>

            {#if post.is_fallback}
                <p class="text-muted-foreground mb-8 rounded-md text-xs italic">
                    {translate(locale, 'blog.fallbackNotice')}
                </p>
            {/if}

            <article
                class="blog-article prose prose-sm dark:prose-invert max-w-none"
                lang={article_lang}
            >
                {@html post.html}
            </article>

            <!-- Mobile TOC -->
            {#if post.headings.length}
                <div class="mt-12 lg:hidden">
                    <PostToc headings={post.headings} {locale} />
                </div>
            {/if}
        </main>
    </div>
{:else}
    <p class="text-muted-foreground text-sm">
        {translate(locale, 'blog.postNotFound')}
    </p>
{/if}

<script lang="ts">
import PostToc from '$lib/components/PostToc.svelte'
import manifestData from '$lib/data/route-manifest.json'
import {format_date, translate, type Locale} from '$lib/i18n/runtime'
import type {BlogPost, RouteManifest} from '$lib/types/manifest'

const manifest = manifestData as RouteManifest

const {locale, slug} = $props<{locale: Locale; slug: string}>()

const post = $derived<BlogPost | undefined>(
    manifest.blogPosts.find(p => p.locale === locale && p.slug === slug),
)
const formatted_date = $derived(post && format_date(locale, post.frontmatter.createdAt))
const article_lang = $derived(post?.is_fallback ? post.source_locale : locale)
</script>
