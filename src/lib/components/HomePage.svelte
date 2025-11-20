<section class="max-w-2xl space-y-6 text-center">
    <p class="text-muted-foreground text-sm">
        <span class="mr-2 inline-block" style="animation: var(--animate-waving-hand)"> 👋 </span>
        {translate(locale, 'home.heroIntro')}
    </p>

    <h2 class="text-2xl font-semibold">
        {translate(locale, 'home.heroTitle')}
    </h2>

    <div class="flex justify-center gap-3">
        <a
            href="/{locale}/projects"
            class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-medium"
        >
            {translate(locale, 'common.nav.projects')}
        </a>
        <a
            href="/{locale}/blog"
            class="border-border text-foreground hover:bg-muted rounded-full border px-4 py-2 text-sm"
        >
            {translate(locale, 'common.nav.blog')}
        </a>
    </div>

    <div class="pt-4">
        <SocialLinks />
    </div>
</section>

<script>
import SocialLinks from '$lib/components/SocialLinks.svelte'
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()
</script>
