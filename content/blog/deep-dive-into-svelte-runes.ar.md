---
title: نظرة عميقة على Svelte 5 Runes
description: استكشاف $state و $derived و $effect في التطبيقات الحقيقية.
createdAt: 2024-10-18
tags: ["svelte", "runes", "ويب"]
---

# نظرة عميقة على Svelte 5 Runes

قدمت Svelte 5 مفهوم *الرونز*، وهو نموذج تفاعلي أبسط وأكثر قابلية للتوقع. إذا كان الإصدار الثالث يشعر بالسحر، فإن الإصدار الخامس يشعر بالوضوح، ويمكن تتبعه بسهولة داخل الفرق، ويجعل الرسم البياني للبيانات واضحاً بلا مفاجآت خفية.

:::info
**Callout**: الأمثلة هنا تلتزم بمجموعة الرونز الداخلية (`$state`, `$derived`, `$effect`, `$props`, `$bindable`) ويمكن إسقاطها مباشرة داخل ملف `.svelte` دون إضافات أخرى.
:::

## ملخص سريع للنموذج العقلي
الرونز هي وحدات تفاعلية صريحة:

- `$state()` — متغيرات تفاعلية تُعدل مباشرة
- `$derived()` — حسابات تفاعلية نقية
- `$effect()` — تأثيرات جانبية مع تنظيف
- `$props()` — خصائص تفاعلية
- `$bindable()` — تمكين الارتباط الثنائي لخاصية

### كيف يتدفق التفاعل مع الرونز
تنشئ رسماً بيانياً صغيراً: عقد `$state` تغذي `$derived`، وهذه بدورها تغذي `$effect`. لا توجد اشتراكات مخفية أو تسميات `$:` مبهمة. عندما يتغير `$state` يعاد حساب `$derived`، وكل `$effect` يعتمد عليه يعاد تشغيله.

:::tip
ارسم حلقة بثلاث عقد: بيانات في `$state`، منطق في `$derived`، تأثيرات في `$effect`. أي قيمة لا تقود واجهة أو I/O أبقها خارج الحلقة.
:::

## $state: حقائق المكون
استخدم `$state` لحالة النموذج، والفلاتر، والمفاتيح، وكل ما يمثل حقيقة محلية. لأنه متغير عادي يمكنك تعديله مباشرة دون طبقة إضافية.

```ts
import {watch} from 'svelte'

type Filter = { search: string; tag_ids: number[]; only_featured: boolean }

const filter_state = $state<Filter>({ search: '', tag_ids: [], only_featured: false })
const has_filters = $derived(filter_state.search.length > 0 || filter_state.tag_ids.length > 0 || filter_state.only_featured)

watch(() => filter_state.search, search => {
  analytics.track('filter_search', { search })
})
```

هذه الكتلة تختصر الاستعلام الحالي وتحدد متى يجب إظهار زر الإزالة. `watch` يبقي القياس منفصلاً عن العرض.

:::warning
تجنب تخزين القيم المشتقة داخل `$state`. اجعل `$state` للمدخلات و`$derived` للنتائج حتى لا تنشئ دورات غير مقصودة.
:::

## $derived: منطق رخيص سهل التركيب
`$derived` مناسب لكل ما يمكن وصفه بأنه “قيمة مشتقة من أخرى”. هو كسول، ميموز، ونقي بلا آثار جانبية. احسب الأعلام المركبة أو القوائم المفلترة دون لمس الـ DOM.

```js
const attendees = $state(['mina', 'jamil', 'noor'])
const filtered_attendees = $derived(attendees.filter(name => name.startsWith('n')))
const attendee_label = $derived(filtered_attendees.length === 1 ? 'guest' : 'guests')
```

تركيب `$derived` يجعل الرسم البياني واضحاً ويحافظ على دوال العرض قصيرة.

:::danger
لا تشغل عمليات غير متزامنة داخل `$derived`. إن كانت القيمة تحتاج شبكة فاجلب البيانات في `$effect` واكتب النتيجة في `$state`.
:::

## $effect: تأثيرات جانبية مضبوطة النطاق
`$effect` يتفاعل مع أي بيانات تُلمس داخله، وهو مثالي للمؤقتات والاشتراكات والعمل الإمبراطوري على DOM.

```js
const now = $state(Date.now())

$effect(() => {
  const id = setInterval(() => now = Date.now(), 1000)
  return () => clearInterval(id)
})
```

التنظيف يمنع تسرب المؤقتات. لأن الجسم يلمس `now` فلن يعاد تشغيل التأثير إلا إذا استبدلت المتغير نفسه.

:::warning
اجعل جسم `$effect` صغيراً. إذا وجدت تشعبات منطقية كثيرة فاقسمه إلى تأثيرات متعددة لتحافظ على توقع إعادة التشغيل.
:::

## تركيب الرونز داخل مكون واحد
مثال صغير لكنه مكتمل يوضح استخدام `$state` و`$derived` ومعالجات الأحداث بدون أي وظائف مساعدة.

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
  <p>القيمة {count}، المضاعف {doubled}، والإيقاع {pace_label}.</p>
  <div class="flex gap-2">
    <button class="btn" onclick={increment}>إضافة {stride}</button>
    <button class="btn ghost" onclick={() => stride = stride + 1}>زيادة الخطوة</button>
    <button class="btn flat" onclick={reset}>إعادة التعيين</button>
  </div>
</section>
```

المعالجات تعدل `$state` مباشرة، والقيم المشتقة تبقي حسابات العرض خارج القالب.

## البيانات الواردة: $props و $bindable
الخصائص تصبح تفاعلية مع `$props()`، و`$bindable()` تتيح الارتباط الثنائي. الجمع بينهما يحافظ على العقد بين الأب والابن.

```svelte
<script>
const { initial_count = 0 } = $props()
const count = $state(initial_count)
const label = $derived(count === 0 ? 'empty' : 'active')

const current = $bindable('current', count)
</script>

<p class="muted">الحالة {label}. ما يراه الأب هو {current}.</p>
```

`$bindable` يعكس `count` في خاصية `current` ليتمكن الأب من `bind:current` دون تعقيد إضافي.

## أنماط عمل للفرق
- استخدم `$state` للحقيقة المحلية و`$derived` لكل ما يمكن إعادة حسابه
- خصص `$effect` لـ I/O والاشتراكات فقط
- نمذج الانتقالات غير المتزامنة كأعلام `$state` (`is_loading`, `load_error`) واشتق واجهة المستخدم منها
- ضع الدوال المساعدة الخاصة بالمجال خارج كتل الرونز لتبقى قابلة للاختبار

## نظرة متعددة اللغات
أحياناً يساعد نقل الفكرة إلى منظومات أخرى.

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

في Java تعيد حساب القيم المشتقة عند الطلب. في Svelte يقوم `$derived` بتخزينها لك.

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

الفكرة نفسها في بايثون: حقيقة أساسية وعرض مشتق. ربط Svelte بينهما هو ما يجعل الواجهة تتحدث مع البيانات فوراً.

## قائمة ترحيل
- استبدل تعليمات `$:` بـ `$derived` أو `$effect` بحسب ما إذا كانت ترجع بيانات أو تنفذ أثراً جانبياً
- اجعل معالجات الأحداث قصيرة وعدل `$state` مباشرة بدلاً من تخزين ردود الأفعال في متغيرات
- راجع البيانات العابرة للمكونات وارفعها عبر `$props` و`$bindable` بدلاً من الاعتماد على السياق حيثما أمكن
- اكتب اختبار تكامل لكل رسم بياني حرج للرونز لضمان تزامن الأعلام والتأثيرات

رونز Svelte 5 تكافئ الرسوم البيانية الصغيرة والواضحة. ابدأ بـ `$state`، اشتق ما تحتاجه، أضف تأثيرات قليلة، وستظل مكوناتك مقروءة حتى مع تضخم الواجهة.
