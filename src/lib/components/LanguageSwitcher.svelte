<button type="button" class="link" onclick={switch_locale}>
    {locale === 'en' ? 'العربية' : 'English'}
</button>

<script lang="ts">
import {build_path_for_locale} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const {locale} = $props<{locale: string}>()

const is_browser = typeof window !== 'undefined'
const route = is_browser ? router.route : null

const current_path = $derived($route?.url?.pathname ?? `/${locale}`)

function switch_locale() {
    if (!is_browser || !router) return

    const next = locale === 'en' ? 'ar' : 'en'
    router.goto(build_path_for_locale(current_path, next))
}
</script>
