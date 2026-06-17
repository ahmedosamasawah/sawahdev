<script lang="ts">
	import { page } from '$app/state';
	import { build_path_for_locale } from '$lib/i18n/runtime';

	const { locale } = $props<{ locale: string }>();

	const current_path = $derived(page.url.pathname);
	const next_locale = $derived(locale === 'en' ? 'ar' : 'en');
	const next_url = $derived(build_path_for_locale(current_path, next_locale));
</script>

<a href={next_url} class="link">
	{locale === 'en' ? 'العربية' : 'English'}
</a>
