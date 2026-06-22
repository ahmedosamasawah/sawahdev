<script lang="ts">
	import { base_url } from '$lib/i18n/runtime';
	import Seo from '$lib/components/Seo.svelte';
	import { build_home_seo } from '$lib/seo';

	const default_path = `${base_url}en/`;
	const seo = build_home_seo('en');
</script>

<Seo {seo} />

<svelte:head>
	<meta http-equiv="refresh" content="0; url={default_path}" />
</svelte:head>
