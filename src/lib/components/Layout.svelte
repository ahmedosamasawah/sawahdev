<script>
	import Decoration from '$lib/components/Decoration.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { base_url, translate } from '$lib/i18n/runtime';
	import { resume_url } from '$lib/links';

	const { locale, children } = $props();
</script>

<div class="relative flex min-h-screen flex-col">
	<Decoration />

	<header class="flex items-center justify-between px-6 py-4">
		<a
			href="{base_url}{locale}"
			class={[
				'transition-all hover:translate-y-2 hover:scale-150',
				locale === 'ar' ? 'hover:-translate-x-2' : 'hover:translate-x-2'
			]}
		>
			<img
				src={locale === 'ar' ? `${base_url}ar-logo.gif` : `${base_url}en-logo.gif`}
				alt="Logo"
				class="size-12"
			/>
		</a>
		<LanguageSwitcher {locale} />
	</header>

	<main class="flex flex-1 flex-col items-center justify-center gap-8 px-6">
		{@render children()}
	</main>

	<footer
		class="text-muted-foreground flex flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm"
	>
		<div class="flex items-center gap-6">
			<a
				href="https://github.com/ahmedosamasawah"
				class="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
				target="_blank"
				rel="noopener"
				aria-label="GitHub"
			>
				<img src="{base_url}github.svg" alt="GitHub" class="h-6 w-6" />
			</a>
			<a
				href="https://www.linkedin.com/in/ahmedossamasawah/"
				class="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
				target="_blank"
				rel="noopener"
				aria-label="LinkedIn"
			>
				<img src="{base_url}linkedin.svg" alt="LinkedIn" class="size-12" />
			</a>
		</div>
		<a
			href={resume_url}
			class="border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-semibold transition-colors"
			target="_blank"
			rel="noopener noreferrer"
		>
			{translate(locale, 'common.footer.resume')}
			<span aria-hidden="true">↗</span>
		</a>
	</footer>
</div>
