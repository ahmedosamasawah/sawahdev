import { blog_posts } from '$lib/data/blog';
import { projects } from '$lib/data/projects';
import { messages, type Locale } from '$lib/i18n/runtime';

type SeoAlternate = {
	hreflang: Locale | 'x-default';
	href: string;
};

type SeoData = {
	title: string;
	description: string;
	canonical: string;
	alternates: SeoAlternate[];
	og: {
		title: string;
		description: string;
		url: string;
		locale: Locale;
		type: 'website' | 'article';
		image: string | null;
	};
	twitter: {
		card: 'summary' | 'summary_large_image';
		title: string;
		description: string;
		image: string | null;
	};
};

const site_origin = 'https://ahmedosamasawah.github.io/sawahdev';
const locales = Object.keys(messages) as Locale[];

function absolute_url(path: string) {
	const clean_path = path.startsWith('/') ? path : `/${path}`;
	return `${site_origin}${clean_path}`;
}

function localized_path(locale: Locale, ...segments: string[]) {
	const path = [locale, ...segments].filter(Boolean).join('/');
	return `/${path}/`;
}

function alternate_path(path: string, locale: Locale) {
	return path.replace(/^\/[^/]+/, `/${locale}`);
}

function build_seo(
	locale: Locale,
	path: string,
	title: string,
	description: string,
	type: SeoData['og']['type'] = 'website',
	image: string | null = null
): SeoData {
	const full_title =
		title === messages[locale].common.siteTitle
			? title
			: `${title} | ${messages[locale].common.siteTitle}`;
	const canonical = absolute_url(path);
	const alternates = [
		...locales.map((alternate_locale) => ({
			hreflang: alternate_locale,
			href: absolute_url(alternate_path(path, alternate_locale))
		})),
		{ hreflang: 'x-default' as const, href: absolute_url(alternate_path(path, 'en')) }
	];

	return {
		title: full_title,
		description,
		canonical,
		alternates,
		og: {
			title: full_title,
			description,
			url: canonical,
			locale,
			type,
			image
		},
		twitter: {
			card: image ? 'summary_large_image' : 'summary',
			title: full_title,
			description,
			image
		}
	};
}

function build_home_seo(locale: Locale) {
	return build_seo(
		locale,
		localized_path(locale),
		messages[locale].common.siteTitle,
		messages[locale].home.intro
	);
}

function build_about_seo(locale: Locale) {
	return build_seo(
		locale,
		localized_path(locale, 'about'),
		messages[locale].about.title,
		messages[locale].about.subtitle
	);
}

function build_projects_seo(locale: Locale) {
	return build_seo(
		locale,
		localized_path(locale, 'projects'),
		messages[locale].projects.title,
		messages[locale].projects.subtitle
	);
}

function build_blog_index_seo(locale: Locale) {
	return build_seo(
		locale,
		localized_path(locale, 'blog'),
		messages[locale].blog.title,
		messages[locale].blog.subtitle
	);
}

function build_project_seo(locale: Locale, id: string) {
	const project = projects.find((item) => item.id === id);
	return build_seo(
		locale,
		localized_path(locale, 'projects', id),
		project?.titles[locale] ?? messages[locale].projects.title,
		project?.descriptions[locale] ?? messages[locale].projects.subtitle
	);
}

function build_blog_post_seo(locale: Locale, slug: string) {
	const post = blog_posts.find((item) => item.locale === locale && item.slug === slug);
	return build_seo(
		locale,
		localized_path(locale, 'blog', slug),
		post?.frontmatter.ogTitle ?? post?.frontmatter.title ?? messages[locale].blog.title,
		post?.frontmatter.ogDescription ??
			post?.frontmatter.description ??
			messages[locale].blog.subtitle,
		'article'
	);
}

function sitemap_paths() {
	return [
		...locales.flatMap((locale) => [
			localized_path(locale),
			localized_path(locale, 'about'),
			localized_path(locale, 'projects'),
			localized_path(locale, 'blog')
		]),
		...projects
			.filter((project) => project.hasDetailPage)
			.flatMap((project) =>
				locales.map((locale) => localized_path(locale, 'projects', project.id))
			),
		...blog_posts.map((post) => localized_path(post.locale, 'blog', post.slug))
	];
}

export {
	absolute_url,
	build_about_seo,
	build_blog_index_seo,
	build_blog_post_seo,
	build_home_seo,
	build_project_seo,
	build_projects_seo,
	site_origin,
	sitemap_paths,
	type SeoData
};
