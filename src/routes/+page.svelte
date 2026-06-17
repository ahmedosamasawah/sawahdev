<script lang="ts">
	import { base_url } from '$lib/i18n/runtime';
	import { absolute_url } from '$lib/seo';

	const default_path = `${base_url}en/`;
	const canonical = absolute_url('/en/');
</script>

<svelte:head>
	<title>Ahmed Osama – Portfolio</title>
	<meta http-equiv="refresh" content="0; url={default_path}" />
	<link rel="canonical" href={canonical} />
</svelte:head>
