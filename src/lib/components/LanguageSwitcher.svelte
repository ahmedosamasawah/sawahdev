<a href={next_url} class="link">
    {locale === 'en' ? 'العربية' : 'English'}
</a>

<script lang="ts">
import {build_path_for_locale} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const {locale} = $props<{locale: string}>()

const is_browser = typeof window !== 'undefined'
const route = is_browser ? router.route : null

const current_path = $derived($route?.url?.pathname ?? `/${locale}`)
const next_locale = $derived(locale === 'en' ? 'ar' : 'en')
const next_url = $derived(build_path_for_locale(current_path, next_locale))
</script>
