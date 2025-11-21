<div class="w-full max-w-2xl space-y-12">
    <section class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {translate(locale, 'about.title')}
        </h1>
        <p class="text-muted-foreground leading-relaxed">
            {translate(locale, 'about.subtitle')}
        </p>
        <a
            href="/{locale}"
            class="hover:text-foreground text-muted-foreground block text-sm underline decoration-dotted underline-offset-4"
        >
            {translate(locale, 'common.backArrow')}
            {translate(locale, 'common.nav.home')}
        </a>
    </section>

    <section class="text-muted-foreground space-y-4 text-sm leading-relaxed">
        {#each paragraphs as paragraph}
            <p>{paragraph}</p>
        {/each}
    </section>
</div>

<script lang="ts">
import {messages, translate, type Locale} from '$lib/i18n/runtime'

const {locale} = $props<{locale: Locale}>()

const paragraphs = $derived(messages[locale as keyof typeof messages].about.body)
</script>
