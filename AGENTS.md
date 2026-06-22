## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter

---

# general
- verify claims by searching docs or looking at source code (even if node_modules or .venv) as much as possible
- you may use contex7 mcp if you need to look up docs
- keep approach simple/minimalist/KISS, we'll iterate as needed
  - don't overthing edge cases, catching errors, etc. all of those checks come with a real cost
  - prefer solutions with less LOC

## coding style
- variables, fns: use snake_case, not camelCase
- components should be in TitleCase (eg Header.svelte)
- no semicolons
- minimal comments
- single quotes
- long lines are fine (up to approx 140 chars)
- make code succinct. remove overcautious guards and checks
- avoid try/catches except where necessary
- avoid unnecessary variables
- avoid short helper functions (2-3), unless used a lot
- typing fixes: minimize code changes. avoid making code more verbose just to fix types. it's fine to silence harmless noise. start with bugs and low hanging fruit

## commit messages
- short, imperative, scoped, concise naming
- format: `<scope[, scope2[...]]>: <verb> <object> [; <verb-2> <object-2>]`
- rename or transform: `<scope>: <before> -> <after>` (eg `Calendar: onMount -> action`)
- scope: the primary area / file touched
- curly sets for families: eg `{Audio,Video}Viewer: fix lazy load`, or `settings.{beta_updates->beta_updates_on}`
- changes in same scope: comma (eg `devsidebar: increase opacity, add z-50`)
- changes in different scope: semicolon (eg `add app.png; remove migrations.sql`)
- use abbrs. eg: ts instead of typescript
- examples
  - TextViewer: mark next page read on scroll
  - typing: add django-{types,stubs-ext}, ignore unimportant files
  - i18n: simplify set_language and number formatter
  - db.open_database: throw if read_only db is missing
  - vite: download pdfjs.html for offline viewer


## frontend
- before committing: run `mise run svcheck --no-warn-ignored` (it MUST be run outside of sandbox, so ask for permission)
- routes are defined in App.svelte
- see vite.config.js or tsconfig.json for the aliases used
- icons: `@lucide/svelte` pkg
- IMPORTANT: use svelte's templating instead of es6's. for example, class={`hello ${world}`} is wrong. simply use class="hello {world}" (error id: check-brace-in-attrs)
- event modifiers are also wrong (eg onsubmit|preventDefault)
- events no longer have colons after `on` (eg, it is onclick, *not* on:click)
- ui: use shadcn components as appropriate
  - `pnpm dlx shadcn-svelte@latest add <components>`
  - https://raw.githubusercontent.com/huntabyte/shadcn-svelte/refs/heads/main/docs/registry.json
  - shadcn is based on bits-ui. review its docs are here: https://bits-ui.com/llms.txt
  - prefer to not change code in `lib/components/ui/` (as it's from shadcn
  - ) unless the requirements specify or imply doing so
- if files are very large, or very nested: use `{#snippet}`s to better manage
- do NOT run `pnpm install` or similar commands. the store is global, so you can't access it. instead, ask me for permission to run it, or tell me to run it
- avoid $effect when possible. prefer $state/$derived.
  - use watch(): https://github.com/svecosystem/runed/blob/main/sites/docs/src/content/utilities/watch.md
    params: use same var names as watch args
- fetch(): do not place in $effect or onMount unless it makes sense. it's fine to place in an async iffe
- $derived() takes an expression DIRECTLY, do NOT pass a function. if you have to use a function: use $derived.by()
- app init code belongs in `src/stores(.svelte)?.js`, not App.svelte


## misc
- do NOT leave comments in response to edits. only comment when needed. especially when code is removed: never add a `// no longer needed` comment
- always read the relevant feature note under `docs/features/` before changing that area; keep those docs fresh when you add or change features

## svelte MCP
You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections
Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation
Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer
Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.
