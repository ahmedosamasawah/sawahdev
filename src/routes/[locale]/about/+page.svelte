<script lang="ts">
	import AboutPage from '$lib/components/AboutPage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_about_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const seo = $derived(build_about_seo(locale));
</script>

<Seo {seo} />
<AboutPage {locale} />
