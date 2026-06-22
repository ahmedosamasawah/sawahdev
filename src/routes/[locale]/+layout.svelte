<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import ar_regular_font from '../../fonts/playpen/PlaypenSansArabic-Regular.woff2?url';
	import en_regular_font from '../../fonts/playpen/PlaypenSans-Regular.woff2?url';

	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const locale = $derived(data.locale);

	$effect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
	});
</script>

<svelte:head>
	{#if locale === 'ar'}
		<link
			rel="preload"
			href={ar_regular_font}
			as="font"
			type="font/woff2"
			crossorigin="anonymous"
		/>
		<link
			rel="preload"
			href={en_regular_font}
			as="font"
			type="font/woff2"
			crossorigin="anonymous"
		/>
	{:else}
		<link
			rel="preload"
			href={en_regular_font}
			as="font"
			type="font/woff2"
			crossorigin="anonymous"
		/>
	{/if}
</svelte:head>

<Layout {locale}>
	{@render children()}
</Layout>
