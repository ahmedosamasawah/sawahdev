<section class="max-w-2xl space-y-4 text-center">
    <h2 class="text-2xl font-semibold">
        {translate(locale, 'about.title')}
    </h2>
    <p class="text-muted-foreground">
        {translate(locale, 'about.subtitle')}
    </p>

    <div class="space-y-3 text-left">
        {#each paragraphs as paragraph}
            <p class="text-muted-foreground text-sm">{paragraph}</p>
        {/each}
    </div>
</section>

<script>
import {messages, translate} from '$lib/i18n/runtime'

const {locale} = $props()

const paragraphs = $derived(messages[locale].about.body)
</script>
