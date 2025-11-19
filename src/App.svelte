<main class="flex min-h-screen flex-col items-center justify-center gap-4">
    {#if $route.url}
        <p class="text-center">
            {translate(locale, 'common.siteTitle')}
        </p>
        <LanguageSwitcher />
    {:else}
        <p class="text-center">Loading...</p>
    {/if}
</main>

<script>
import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte'
import {locale_from_path, translate} from '$lib/i18n/runtime.ts'
import {router} from '$lib/router.ts'

const route = router.route
const locale = $derived(locale_from_path($route.url?.pathname ?? '/'))
</script>
