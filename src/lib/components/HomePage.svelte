<script lang="ts">
	import { blog_posts } from '$lib/data/blog';
	import { base_url, format_date, type Locale, messages, translate } from '$lib/i18n/runtime';

	const { locale } = $props<{ locale: Locale }>();

	const now_items = $derived(messages[locale as Locale].home.now);

	const recent_posts = $derived(
		blog_posts
			.filter((p) => p.locale === locale)
			.sort((a, b) => b.frontmatter.createdAt.localeCompare(a.frontmatter.createdAt))
			.slice(0, 3)
	);
</script>

<div class="w-full max-w-3xl space-y-14">
	<section class="space-y-6">
		<div class="space-y-3">
			<h1 class="text-3xl leading-tight font-semibold">
				{translate(locale, 'home.greeting')}
			</h1>

			<p class="text-muted-foreground text-base leading-relaxed">
				{translate(locale, 'home.intro')}
			</p>
		</div>

		<div class="flex flex-wrap gap-3 text-sm">
			<a href="{base_url}{locale}/projects" class="link">
				{translate(locale, 'common.nav.projects')}
			</a>
			<a href="{base_url}{locale}/blog" class="link">
				{translate(locale, 'common.nav.blog')}
			</a>
			<a href="{base_url}{locale}/about" class="link">
				{translate(locale, 'common.nav.about')}
			</a>
		</div>
	</section>

	<div class="grid gap-10 md:grid-cols-2">
		<section class="space-y-4">
			<h2 class="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
				{translate(locale, 'home.nowTitle')}
			</h2>
			<ul class="space-y-2 text-sm leading-relaxed">
				{#each now_items as item, index (item + index)}
					<li class="text-foreground flex gap-3">
						<span class="bg-primary/70 mt-2 block h-1.5 w-1.5 rounded-full"></span>
						<span class="text-muted-foreground">{item}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="space-y-4">
			<h2 class="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
				{translate(locale, 'home.recentPostsTitle')}
			</h2>
			<div class="space-y-3">
				{#each recent_posts as post (post.slug)}
					<div class="space-y-1">
						<a href="{base_url}{locale}/blog/{post.slug}" class="block space-y-2">
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
</div>
