<script lang="ts">
	import { type Locale, messages, translate } from '$lib/i18n/runtime';

	const { locale } = $props<{ locale: Locale }>();

	const now_items = $derived(messages[locale as Locale].home.now);
	const featured_projects = $derived(messages[locale as Locale].home.featuredProjects);
</script>

<div class="w-full max-w-3xl space-y-10">
	<section class="space-y-6">
		<div class="space-y-3">
			<h1 class="text-3xl leading-tight font-semibold">
				{translate(locale, 'home.greeting')}
			</h1>

			<p class="text-muted-foreground text-base leading-relaxed">
				{translate(locale, 'home.intro')}
			</p>
		</div>
	</section>

	<div class="grid gap-7">
		<section class="space-y-4">
			<h2 class="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
				{translate(locale, 'home.nowTitle')}
			</h2>
			<div class="space-y-3 text-sm leading-relaxed">
				{#each now_items as item, index (item + index)}
					<p class="text-muted-foreground">{item}</p>
				{/each}
			</div>
		</section>

		<section class="space-y-4">
			<h2 class="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
				{translate(locale, 'home.featuredProjectsTitle')}
			</h2>
			<div class="flex flex-wrap gap-2 text-sm leading-relaxed">
				{#each featured_projects as project (project.url)}
					<a
						href={project.url}
						target="_blank"
						rel="noreferrer"
						class="border-border/80 bg-background/50 hover:border-primary/40 hover:text-foreground inline-flex rounded-md border px-3 py-1.5 transition-colors"
					>
						{project.name}
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>
