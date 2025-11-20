<Button variant="link" size="sm" onclick={switch_locale}>
    {current_locale === 'en' ? 'العربية' : 'English'}
</Button>

<script>
import {Button} from '$lib/components/ui/button/index'
import {build_path_for_locale, locale_from_path} from '$lib/i18n/runtime'
import {router} from '$lib/router'

const route = router.route

const current_locale = $derived(locale_from_path($route.url?.pathname ?? '/'))

function switch_locale() {
    if (!$route.url) return

    const next = current_locale === 'en' ? 'ar' : 'en'
    router.goto(build_path_for_locale($route.url.pathname, next))
}
</script>
