<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';

	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const locale = $derived(data.locale);

	$effect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
	});
</script>

<Layout {locale}>
	{@render children()}
</Layout>
