<script lang="ts">
	import type { SeoData } from '$lib/seo';

	let { seo }: { seo: SeoData } = $props();
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	{#each seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<meta property="og:title" content={seo.og.title} />
	<meta property="og:description" content={seo.og.description} />
	<meta property="og:url" content={seo.og.url} />
	<meta property="og:locale" content={seo.og.locale} />
	<meta property="og:type" content={seo.og.type} />
	<meta name="twitter:card" content={seo.twitter.card} />
	<meta name="twitter:title" content={seo.twitter.title} />
	<meta name="twitter:description" content={seo.twitter.description} />
	{#if seo.og.image}
		<meta property="og:image" content={seo.og.image} />
	{/if}
	{#if seo.twitter.image}
		<meta name="twitter:image" content={seo.twitter.image} />
	{/if}
</svelte:head>
