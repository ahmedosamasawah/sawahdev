<script lang="ts">
	import BlogPostPage from '$lib/components/BlogPostPage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_blog_post_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const seo = $derived(build_blog_post_seo(data.locale, data.slug));
</script>

<Seo {seo} />
<BlogPostPage locale={data.locale} slug={data.slug} />
