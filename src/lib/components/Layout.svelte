<div class="relative flex min-h-screen flex-col">
    <Decoration />
    <FallingStars />

    <header class="flex items-center justify-end px-6 py-4">
        <LanguageSwitcher {locale} />
    </header>

    <main class="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        {@render children()}
    </main>

    <footer
        class="text-muted-foreground flex flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm"
    >
        <div class="flex flex-wrap items-center gap-4">
            <a
                href="https://github.com/AhmedOsamaDev"
                class="hover:text-foreground"
                target="_blank"
                rel="noopener"
            >
                github
            </a>
            <a
                href="https://www.linkedin.com/in/ahmedosamadev"
                class="hover:text-foreground"
                target="_blank"
                rel="noopener"
            >
                linkedin
            </a>
            <a
                href="https://x.com/ahmedosamadev"
                class="hover:text-foreground"
                target="_blank"
                rel="noopener"
            >
                twitter
            </a>
        </div>
        <a
            href="https://github.com/AhmedOsamaDev/portfolio"
            class="hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
        >
            {translate(locale, 'common.footer.sourceCode')}
        </a>
    </footer>
</div>

<script lang="ts">
import type {Snippet} from 'svelte'

import Decoration from '$lib/components/Decoration.svelte'
import FallingStars from '$lib/components/FallingStars.svelte'
import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte'
// import SocialLinks from '$lib/components/SocialLinks.svelte'
import {translate, type Locale} from '$lib/i18n/runtime'

const {locale, children} = $props<{locale: Locale; children: Snippet}>()
</script>
