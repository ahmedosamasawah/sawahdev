---
title: A Deep Dive Into Svelte 5 Runes
description: Exploring $state, $derived, and $effect in real world apps.
createdAt: 2024-10-18
tags: ["svelte", "runes", "webdev"]
---

# A Deep Dive Into Svelte 5 Runes

Svelte 5 introduced *runes*, a simplified and more predictable reactivity model.  
If Svelte 3 felt magical, Svelte 5 feels intentional.

## What are runes?
Runes are *explicit* reactive primitives:

- `$state()` — reactive variables  
- `$derived()` — reactive computations  
- `$effect()` — reactive side-effects  
- `$props()` — reactive props  
- `$bindable()` — for two-way binding  

## Why they matter
They remove ambiguity from Svelte’s old `$:` reactivity and make the mental model much cleaner.

### Real-world example from this portfolio
```ts
const locale = $derived(locale_from_path($route.url.pathname))
const page = $derived.by(() => computePageFromUrl($route.url))
```

This is cleaner, more predictable, and easier to test.

Final thoughts

Runes are the best thing to happen to Svelte since the compiler.

