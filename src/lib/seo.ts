import { messages, type Locale } from '$lib/i18n/runtime';

type SeoData = {
	title: string;
	description: string;
	canonical: string;
	locale: Locale;
	alternates: {
		hreflang: Locale | 'x-default';
		href: string;
	}[];
};

const site_origin = 'https://ahmedosamasawah.github.io/sawahdev';
const locales = Object.keys(messages) as Locale[];

function absolute_url(path: string) {
	return `${site_origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function localized_path(locale: Locale) {
	return `/${locale}/`;
}

function build_home_seo(locale: Locale): SeoData {
	const title = messages[locale].common.siteTitle;
	const description = messages[locale].home.intro;

	return {
		title,
		description,
		canonical: absolute_url(localized_path(locale)),
		locale,
		alternates: [
			...locales.map((hreflang) => ({
				hreflang,
				href: absolute_url(localized_path(hreflang))
			})),
			{ hreflang: 'x-default' as const, href: absolute_url(localized_path('en')) }
		]
	};
}

function sitemap_paths() {
	return locales.map(localized_path);
}

export { absolute_url, build_home_seo, sitemap_paths, type SeoData };
