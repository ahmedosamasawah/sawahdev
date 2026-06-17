<script lang="ts">
	import BlogIndexPage from '$lib/components/BlogIndexPage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_blog_index_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const seo = $derived(build_blog_index_seo(locale));
</script>

<Seo {seo} />
<BlogIndexPage {locale} />
