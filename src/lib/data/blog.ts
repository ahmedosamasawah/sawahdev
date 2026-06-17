import type { Locale } from '$lib/i18n/runtime';

type Frontmatter = {
	title: string;
	description: string;
	createdAt: string;
	tags: string[];
	ogTitle?: string;
	ogDescription?: string;
};

type Heading = {
	id: string;
	text: string;
	level: number;
};

type BlogPost = {
	id: string;
	slug: string;
	locale: Locale;
	source_locale: Locale;
	is_fallback: boolean;
	frontmatter: Frontmatter;
	html: string;
	headings: Heading[];
};

const locales = ['en', 'ar'] as const;
const files = import.meta.glob('../../../content/blog/*.md', {
	eager: true,
	import: 'default',
	query: '?raw'
}) as Record<string, string>;

function parse_blog_filename(file_path: string) {
	const filename = file_path.split('/').pop() ?? '';
	const without_ext = filename.replace(/\.md$/i, '');
	const parts = without_ext.split('.');
	const locale = parts.pop() as Locale;
	const slug = parts.join('.');
	return { slug, locale };
}

function strip_quotes(value: string) {
	return value.replace(/^['"]|['"]$/g, '');
}

function parse_array(value: string) {
	return value
		.replace(/^\[|\]$/g, '')
		.split(',')
		.map((item) => strip_quotes(item.trim()))
		.filter(Boolean);
}

function parse_frontmatter(raw: string) {
	const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
	if (!match) return { frontmatter: {} as Frontmatter, content: raw };

	const frontmatter = {} as Frontmatter;

	for (const line of match[1].split('\n')) {
		const [key, ...rest] = line.split(':');
		if (!key || rest.length === 0) continue;

		const value = rest.join(':').trim();
		frontmatter[key.trim() as keyof Frontmatter] = (
			value.startsWith('[') ? parse_array(value) : strip_quotes(value)
		) as never;
	}

	return { frontmatter, content: match[2] };
}

function escape_html(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function slugify_heading(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function render_inline(value: string) {
	return escape_html(value)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/_([^_]+)_/g, '<em>$1</em>');
}

function render_callout(type: string, content: string) {
	const classes = {
		info: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-900 dark:text-emerald-50',
		tip: 'bg-sky-50/80 dark:bg-sky-950/20 border-sky-500/50 text-sky-900 dark:text-sky-50',
		warning:
			'bg-amber-50/80 dark:bg-amber-950/20 border-amber-500/50 text-amber-900 dark:text-amber-50',
		danger: 'bg-red-50/80 dark:bg-red-950/20 border-red-500/50 text-red-900 dark:text-red-50'
	}[type];

	return `<div class="callout ${classes} my-6 rounded-xl border-l-4 p-4 shadow-sm"><div class="callout-content">${render_markdown(content)}</div></div>`;
}

function flush_paragraph(html: string[], paragraph: string[]) {
	if (!paragraph.length) return;
	html.push(`<p>${render_inline(paragraph.join('\n')).replace(/\n/g, '<br>')}</p>`);
	paragraph.length = 0;
}

function render_markdown(markdown: string): string {
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const html: string[] = [];
	const paragraph: string[] = [];

	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			flush_paragraph(html, paragraph);
			continue;
		}

		const code_match = /^```(\w+)?$/.exec(trimmed);
		if (code_match) {
			flush_paragraph(html, paragraph);
			const code: string[] = [];
			i += 1;
			while (i < lines.length && !lines[i].startsWith('```')) {
				code.push(lines[i]);
				i += 1;
			}
			html.push(
				`<pre><code class="language-${code_match[1] ?? 'text'}">${escape_html(code.join('\n'))}</code></pre>`
			);
			continue;
		}

		const callout_match = /^:::(info|tip|warning|danger)$/.exec(trimmed);
		if (callout_match) {
			flush_paragraph(html, paragraph);
			const content: string[] = [];
			i += 1;
			while (i < lines.length && lines[i].trim() !== ':::') {
				content.push(lines[i]);
				i += 1;
			}
			html.push(render_callout(callout_match[1], content.join('\n')));
			continue;
		}

		const heading_match = /^(#{1,6})\s+(.+)$/.exec(trimmed);
		if (heading_match) {
			flush_paragraph(html, paragraph);
			const level = heading_match[1].length;
			const text = heading_match[2].trim();
			html.push(`<h${level} id="${slugify_heading(text)}">${render_inline(text)}</h${level}>`);
			continue;
		}

		if (trimmed.startsWith('- ')) {
			flush_paragraph(html, paragraph);
			const items: string[] = [];
			while (i < lines.length && lines[i].trim().startsWith('- ')) {
				items.push(`<li>${render_inline(lines[i].trim().slice(2))}</li>`);
				i += 1;
			}
			i -= 1;
			html.push(`<ul>${items.join('')}</ul>`);
			continue;
		}

		if (/^\d+\.\s+/.test(trimmed)) {
			flush_paragraph(html, paragraph);
			const items: string[] = [];
			while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
				items.push(`<li>${render_inline(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
				i += 1;
			}
			i -= 1;
			html.push(`<ol>${items.join('')}</ol>`);
			continue;
		}

		paragraph.push(line);
	}

	flush_paragraph(html, paragraph);
	return html.join('\n');
}

function extract_headings(markdown: string): Heading[] {
	const headings: Heading[] = [];
	let in_code = false;

	for (const line of markdown.split('\n')) {
		if (line.startsWith('```')) {
			in_code = !in_code;
			continue;
		}
		if (in_code) continue;

		const match = /^(#{1,6})\s+(.+)$/.exec(line);
		if (!match) continue;

		const text = match[2].trim();
		headings.push({ id: slugify_heading(text), text, level: match[1].length });
	}

	return headings;
}

function build_source_posts() {
	return Object.entries(files)
		.map(([file_path, raw]) => {
			const { slug, locale } = parse_blog_filename(file_path);
			const { frontmatter, content } = parse_frontmatter(raw);

			return {
				id: `${slug}-${locale}`,
				slug,
				locale,
				source_locale: locale,
				is_fallback: false,
				frontmatter,
				html: render_markdown(content),
				headings: extract_headings(content)
			};
		})
		.filter((post) => post.slug && locales.includes(post.locale));
}

function build_blog_posts(): BlogPost[] {
	const source_posts = build_source_posts();
	const by_slug = new Map<string, Partial<Record<Locale, BlogPost>>>();
	const posts: BlogPost[] = [];

	for (const post of source_posts) {
		const entry = by_slug.get(post.slug) ?? {};
		entry[post.locale] = post;
		by_slug.set(post.slug, entry);
	}

	for (const [slug, by_locale] of by_slug) {
		const default_locale = by_locale.en ? 'en' : locales.find((locale) => by_locale[locale]);
		if (!default_locale) continue;

		for (const locale of locales) {
			const source_post = by_locale[locale] ?? by_locale[default_locale];
			if (!source_post) continue;

			posts.push({
				...source_post,
				id: `${slug}-${locale}`,
				locale,
				source_locale: source_post.locale,
				is_fallback: source_post.locale !== locale
			});
		}
	}

	return posts;
}

const blog_posts = build_blog_posts();

export { blog_posts, type BlogPost, type Frontmatter, type Heading };
