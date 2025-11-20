<section class="max-w-2xl space-y-6">
    <div class="text-center">
        <h2 class="text-2xl font-semibold">
            {translate(locale, 'projects.title')}
        </h2>
        <p class="text-muted-foreground">
            {translate(locale, 'projects.subtitle')}
        </p>
    </div>

    <div class="space-y-4">
        {#each projects as project (project.id)}
            <article
                class="border-border bg-card hover:border-accent rounded-lg border p-4 transition"
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-base font-semibold">{project.titles[locale]}</h3>
                        <p class="text-muted-foreground text-xs">{project.role[locale]}</p>
                    </div>
                    {#if project.links.demo}
                        <a
                            class="text-sm underline"
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {translate(locale, 'projects.viewProject')}
                        </a>
                    {/if}
                </div>

                <p class="text-muted-foreground mt-2 text-sm">{project.descriptions[locale]}</p>

                <div class="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {#each project.tech as tag (tag)}
                        <span class="bg-accent text-accent-foreground rounded-full px-2 py-1"
                            >{tag}</span
                        >
                    {/each}
                    {#if project.links.github}
                        <a
                            class="text-foreground underline"
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    {/if}
                </div>
            </article>
        {/each}
    </div>
</section>

<script>
import {projects} from '$lib/data/projects'
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()
</script>
