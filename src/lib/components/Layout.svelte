<div class="relative flex min-h-screen flex-col">
    <Decoration />
    <FallingStars />

    <header class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-6">
            <h1 class="text-lg font-bold">
                {translate(locale, 'common.siteTitle')}
            </h1>
            <nav class="text-muted-foreground hidden gap-4 text-sm md:flex">
                <a href="/{locale}" class="hover:text-foreground">
                    {translate(locale, 'common.nav.home')}
                </a>
                <a href="/{locale}/projects" class="hover:text-foreground">
                    {translate(locale, 'common.nav.projects')}
                </a>
                <a href="/{locale}/blog" class="hover:text-foreground">
                    {translate(locale, 'common.nav.blog')}
                </a>
                <a href="/{locale}/about" class="hover:text-foreground">
                    {translate(locale, 'common.nav.about')}
                </a>
            </nav>
        </div>
        <LanguageSwitcher />
    </header>

    <main class="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        {@render children()}
    </main>

    <footer class="text-muted-foreground flex items-center justify-between px-6 py-4 text-xs">
        <span>© {new Date().getFullYear()} Ahmed Osama</span>
        <SocialLinks />
    </footer>
</div>

<script>
import Decoration from '$lib/components/Decoration.svelte'
import FallingStars from '$lib/components/FallingStars.svelte'
import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte'
import SocialLinks from '$lib/components/SocialLinks.svelte'
import {translate} from '$lib/i18n/runtime'

const {locale, children} = $props()
</script>
