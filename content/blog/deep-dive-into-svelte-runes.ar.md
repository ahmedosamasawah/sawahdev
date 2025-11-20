---
title: نظرة عميقة على Svelte 5 Runes
description: استكشاف $state و $derived و $effect في التطبيقات الحقيقية.
createdAt: 2024-10-18
tags: ["svelte", "runes", "ويب"]
---

# نظرة عميقة على Svelte 5 Runes

قدمت Svelte 5 مفهوم **الرونز**، وهي طريقة تفاعلية جديدة أكثر وضوحاً وتوقعًا من النظام القديم.

## ما هي الرونز؟
الرونز هي وحدات تفاعلية واضحة ومباشرة:

- `$state()` — متغيرات تفاعلية  
- `$derived()` — متغيرات مشتقة  
- `$effect()` — تأثيرات جانبية تفاعلية  
- `$props()` — خصائص تفاعلية  
- `$bindable()` — ربط ثنائي الاتجاه  

## لماذا هي مهمة؟
لأنها تزيل الغموض من `$:` القديم وتجعل من السهل تتبع التفاعلية.

## مثال من هذا الموقع
```ts
const locale = $derived(locale_from_path($route.url.pathname))
const page = $derived.by(() => computePageFromUrl($route.url))
```

أكثر وضوحاً وأسهل للاختبار.

الخلاصة

الرونز هي أفضل ما حصل لـ Svelte منذ ظهور المترجم نفسه.

