<script lang="ts">
	import ProjectsPage from '$lib/components/ProjectsPage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_projects_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const seo = $derived(build_projects_seo(locale));
</script>

<Seo {seo} />
<ProjectsPage {locale} />
