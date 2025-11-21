---
title: A Deep Dive Into Svelte 5 Runes
description: Exploring $state, $derived, and $effect in real world apps.
createdAt: 2024-10-18
tags: ["svelte", "runes", "webdev"]
---

# A Deep Dive Into Svelte 5 Runes

Svelte 5 introduced *runes*, a simplified and more predictable reactivity model. If Svelte 3 felt magical, Svelte 5 feels intentional, traceable, and easier to reason about with a team. Runes make the data graph obvious, eliminate the spooky action of `$:` labels, and keep your mental stack short even when components get busy.

:::info
**Callout**: This walkthrough sticks to the default rune set (`$state`, `$derived`, `$effect`, `$props`, `$bindable`) so you can drop the snippets straight into a `.svelte` file without leaning on extras.
:::

## Rune mental model in 90 seconds
Runes are explicit reactive primitives:

- `$state()` — reactive variables you mutate directly
- `$derived()` — reactive computations that stay pure
- `$effect()` — reactive side-effects that clean up
- `$props()` — reactive props
- `$bindable()` — enables two-way binding for a prop

### How reactivity flows with runes
You create a small graph where `$state` nodes feed `$derived` nodes, which feed `$effect` nodes. No labels, no hidden subscriptions — everything is local and legible. When a `$state` changes, dependent `$derived` values recompute, and any `$effect` that touched them reruns.

:::tip
Start by sketching a three-node loop: data in `$state`, logic in `$derived`, effects in `$effect`. If a value does not drive UI or I/O, keep it out of the graph.
:::

## $state: modeling local truth
Use `$state` for the facts of a component: filters, toggles, form drafts, modal visibility. Because `$state` is just a variable, you can mutate it inline without ceremony.

```ts
import {watch} from 'svelte'

type Filter = { search: string; tag_ids: number[]; only_featured: boolean }

const filter_state = $state<Filter>({ search: '', tag_ids: [], only_featured: false })
const has_filters = $derived(filter_state.search.length > 0 || filter_state.tag_ids.length > 0 || filter_state.only_featured)

watch(() => filter_state.search, search => {
  analytics.track('filter_search', { search })
})
```

That single block captures the current query and highlights when the UI should render a “clear” control. The `watch` keeps analytics decoupled from UI rendering.

:::warning
Avoid stashing derived values back into `$state`. Keep `$state` for inputs and `$derived` for computed views so you do not create accidental cycles.
:::

## $derived: cheap, composable logic
`$derived` is for anything you can explain as “X based on Y.” It is lazy, memoized, and pure — no side-effects allowed. Compute combined flags, filtered arrays, and formatted strings without touching the DOM.

```js
const attendees = $state(['mina', 'jamil', 'noor'])
const filtered_attendees = $derived(attendees.filter(name => name.startsWith('n')))
const attendee_label = $derived(filtered_attendees.length === 1 ? 'guest' : 'guests')
```

Stacking `$derived` values makes the data graph obvious and keeps render functions tiny.

:::danger
Do not perform async work inside `$derived`. If a computed value needs data from the network, move the async fetch to `$effect` and write the result into `$state`.
:::

## $effect: side-effects that stay scoped
`$effect` reacts to whatever data you touch inside it. It is ideal for timers, subscriptions, and imperative DOM work.

```js
const now = $state(Date.now())

$effect(() => {
  const id = setInterval(() => now = Date.now(), 1000)
  return () => clearInterval(id)
})
```

The cleanup keeps intervals from leaking. Because the body references `now`, the effect reruns only if you swap out the state variable entirely, not on every tick.

:::warning
Keep `$effect` bodies small. If you find branching logic or multiple responsibilities, split into separate effects so reruns stay predictable.
:::

## Putting the runes together in a component
Here is a small but complete component that shows how `$state`, `$derived`, and event handlers fit together without helpers.

```svelte
<script>
const count = $state(1)
const stride = $state(2)
const doubled = $derived(count * 2)
const pace_label = $derived(count > 10 ? 'spicy' : 'chill')

const increment = () => count += stride
const reset = () => {
  count = 1
  stride = 2
}
</script>

<section class="panel space-y-3">
  <p>Count is {count}, doubled is {doubled}, pace feels {pace_label}.</p>
  <div class="flex gap-2">
    <button class="btn" onclick={increment}>Add {stride}</button>
    <button class="btn ghost" onclick={() => stride = stride + 1}>Stride + 1</button>
    <button class="btn flat" onclick={reset}>Reset</button>
  </div>
</section>
```

The handlers mutate `$state` directly. The `$derived` values keep render-time math out of the markup.

## Incoming data: $props and $bindable
Props become reactive with `$props()`, and `$bindable()` opts a prop into two-way binding. Combine them to keep parent-child contracts honest.

```svelte
<script>
const { initial_count = 0 } = $props()
const count = $state(initial_count)
const label = $derived(count === 0 ? 'empty' : 'active')

const current = $bindable('current', count)
</script>

<p class="muted">State is {label}. Parent sees {current}.</p>
```

`$bindable` mirrors `count` into a `current` prop so the parent can `bind:current` without extra plumbing.

## Patterns for teams
- Prefer `$state` for local truth and `$derived` for anything you can recompute
- Keep `$effect` for I/O and subscriptions only
- Model async transitions as `$state` flags (`is_loading`, `load_error`) and derive UI from them
- Encapsulate domain helpers outside of rune blocks to keep them testable

## Multi-language perspectives
Sometimes it helps to translate the mental model into other ecosystems.

```java
public class RuneSnapshot {
    private int count = 0;

    public void increment_once() {
        count += 1;
    }

    public int doubled() {
        return count * 2;
    }
}
```

In Java you recompute derived values on demand. In Svelte, `$derived` caches this work for you.

```py
from dataclasses import dataclass

@dataclass
class RuneState:
    count: int = 0

    @property
    def doubled(self) -> int:
        return self.count * 2

state = RuneState()
state.count += 3
print(state.doubled)
```

Python mirrors the idea: a base fact plus a computed view. Svelte’s runes simply wire those computations to the UI automatically.

## Migration checklist
- Replace `$:` statements with `$derived` or `$effect` based on whether they return data or run side-effects
- Keep event handlers small and mutate `$state` directly rather than storing callbacks in variables
- Audit data that crosses components and promote it through `$props` and `$bindable` instead of context where possible
- Write one integration test per critical rune graph to ensure the derived flags and effects fire together

Svelte 5’s runes reward small, explicit graphs. Start with `$state`, derive what you need, attach a few concise effects, and your components stay readable even as the UI grows.
