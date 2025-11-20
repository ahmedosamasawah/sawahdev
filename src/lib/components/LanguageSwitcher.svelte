<Button variant="link" size="sm" onclick={switch_locale}>
    {locale === 'en' ? 'العربية' : 'English'}
</Button>

<script lang="ts">
import {Button} from '$lib/components/ui/button/index'
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
