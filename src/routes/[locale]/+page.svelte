<script lang="ts">
	import HomePage from '$lib/components/HomePage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_home_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const seo = $derived(build_home_seo(locale));
</script>

<Seo {seo} />
<HomePage {locale} />
