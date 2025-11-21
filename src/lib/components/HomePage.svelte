<div class="w-full max-w-2xl space-y-12">
    <section class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {translate(locale, 'home.greeting')}
        </h1>

        <p class="text-muted-foreground leading-relaxed">
            {translate(locale, 'home.intro')}
        </p>

        <div class="flex flex-wrap gap-4 text-sm">
            <a
                href="/{locale}/projects"
                class="hover:text-foreground text-muted-foreground underline decoration-dotted underline-offset-4"
            >
                {translate(locale, 'common.nav.projects')}
            </a>
            <a
                href="/{locale}/blog"
                class="hover:text-foreground text-muted-foreground underline decoration-dotted underline-offset-4"
            >
                {translate(locale, 'common.nav.blog')}
            </a>
            <a
                href="/{locale}/about"
                class="hover:text-foreground text-muted-foreground underline decoration-dotted underline-offset-4"
            >
                {translate(locale, 'common.nav.about')}
            </a>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">
            {translate(locale, 'home.nowTitle')}
        </h2>
        <ul class="text-muted-foreground space-y-2 text-sm leading-relaxed">
            {#each now_items as item}
                <li class="flex gap-2">
                    <span>•</span>
                    <span>{item}</span>
                </li>
            {/each}
        </ul>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">
            {translate(locale, 'home.recentPostsTitle')}
        </h2>
        <div class="space-y-3">
            {#each recent_posts as post}
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
        </div>
    </section>
</div>

<script>
import manifest from '$lib/data/route-manifest.json'
import {format_date, messages, translate} from '$lib/i18n/runtime'

const {locale} = $props()

const now_items = $derived(messages[locale].home.now)

const recent_posts = $derived(
    manifest.blogPosts
        .filter(p => p.locale === locale)
        .sort((a, b) => b.frontmatter.createdAt.localeCompare(a.frontmatter.createdAt))
        .slice(0, 3),
)
</script>
