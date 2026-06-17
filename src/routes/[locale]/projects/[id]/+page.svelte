<script lang="ts">
	import ProjectPage from '$lib/components/ProjectPage.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { build_project_seo } from '$lib/seo';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const seo = $derived(build_project_seo(data.locale, data.id));
</script>

<Seo {seo} />
<ProjectPage locale={data.locale} projectId={data.id} />
