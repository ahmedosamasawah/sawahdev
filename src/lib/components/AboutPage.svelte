<section class="max-w-2xl space-y-4 text-center">
    <h2 class="text-2xl font-semibold">
        {translate(locale, 'about.title')}
    </h2>
    <p class="text-muted-foreground">
        {translate(locale, 'about.subtitle')}
    </p>
</section>

<script>
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()
</script>
