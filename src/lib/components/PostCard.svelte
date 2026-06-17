<script>
	import { base_url, format_date, translate } from '$lib/i18n/runtime';

	const { locale, post } = $props();

	const formatted_date = $derived(
		post.frontmatter.createdAt ? format_date(locale, post.frontmatter.createdAt) : ''
	);
</script>

<article
	class="border-border bg-card hover:border-accent rounded-lg border p-4 text-left transition"
>
	<a href="{base_url}{locale}/blog/{post.slug}" class="block space-y-2">
		<h3 class="text-base font-semibold">
			{post.frontmatter.title}
		</h3>

		{#if post.frontmatter.description}
			<p class="text-muted-foreground text-sm">
				{post.frontmatter.description}
			</p>
		{/if}

		<div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
			{#if formatted_date}
				<span>{formatted_date}</span>
			{/if}

			{#if post.frontmatter.tags?.length}
				<span aria-hidden="true">·</span>
				<span>
					{translate(locale, 'blog.tags')}: {post.frontmatter.tags.join(', ')}
				</span>
			{/if}
		</div>
	</a>
</article>
