<div class="og">
    <p class="eyebrow">{locale}</p>
    <h1>{title}</h1>
    {#if subtitle}
        <p class="subtitle">{subtitle}</p>
    {/if}
    {#if tags?.length}
        <p class="meta">{tags.join(', ')}</p>
    {/if}
    {#if date}
        <p class="meta">{date}</p>
    {/if}
    {#if is_fallback}
        <p class="badge">Fallback</p>
    {/if}
</div>

<script>
const {title, subtitle, locale, tags = [], date, is_fallback = false} = $props()
</script>

<style>
.og {
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px;
    background: radial-gradient(circle at 20% 20%, #8b5cf6 0, #111827 45%), #0f172a;
    color: #e5e7eb;
    font-family:
        'Inter',
        system-ui,
        -apple-system,
        sans-serif;
    box-sizing: border-box;
    gap: 12px;
}

.og h1 {
    margin: 0;
    font-size: 64px;
    line-height: 1.05;
    font-weight: 700;
}

.eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 14px;
    color: #c7d2fe;
}

.subtitle {
    margin: 0;
    font-size: 28px;
    color: #cbd5e1;
}

.meta {
    margin: 0;
    font-size: 20px;
    color: #94a3b8;
}

.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    margin-top: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
    font-size: 16px;
    width: fit-content;
}
</style>
