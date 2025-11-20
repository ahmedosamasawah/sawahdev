---
title: Building My Own SSG With Svelte
description: Why I didn’t use SvelteKit and what I learned instead.
createdAt: 2024-09-12
tags: ["ssg", "js", "svelte"]
---

# Building My Own SSG With Svelte

Most people would just use SvelteKit's `adapter-static` — and honestly, they should.  
But I wanted to understand the mechanics behind:

- file system scanning  
- manifest generation  
- client+server builds  
- Markdown compilation  
- routing systems  
- i18n  
- OG image generation  

## What I built
My SSG includes:

- A custom manifest system  
- Blog file parsing  
- Build-time rendering  
- i18n  
- Static routing  
- A tiny Navgo-driven router  

## Lessons learned
1. File system APIs are your best friend.  
2. Markdown parsing is trickier than you think.  
3. Don’t implement your own SSG unless you’re doing it for fun or learning.

But I enjoyed every moment.

