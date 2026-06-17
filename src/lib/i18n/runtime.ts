import { base } from '$app/paths';
import ar from '$lib/i18n/ar.json';
import en from '$lib/i18n/en.json';

const messages = { en, ar } as const;

type Locale = keyof typeof messages;
const base_url = `${base}/`;
const base_path = base_url.replace(/\/$/, '');

function is_locale(locale: string | undefined): locale is Locale {
	return locale === 'en' || locale === 'ar';
}

function get_nested(obj: unknown, path: string): unknown {
	return path.split('.').reduce<unknown>((acc, key) => {
		if (!acc || typeof acc !== 'object') return undefined;
		return (acc as Record<string, unknown>)[key];
	}, obj);
}

function translate(locale: Locale, key: string): string {
	const value = get_nested(messages[locale], key);
	return typeof value === 'string' ? value : key;
}

function locale_from_path(pathname: string): Locale | undefined {
	const clean_path = pathname.startsWith(base_path)
		? pathname.slice(base_path.length) || '/'
		: pathname;
	const segment = clean_path.split('/').filter(Boolean)[0];
	const [defaultLocale] = Object.keys(messages) as Locale[];
	return is_locale(segment) ? segment : defaultLocale;
}

function build_path_for_locale(pathname: string, locale: Locale): string {
	const clean_path = pathname.startsWith(base_path)
		? pathname.slice(base_path.length) || '/'
		: pathname;
	const segments = clean_path.split('/').filter(Boolean);

	const clean_segment = segments[0];
	const is_locale_segment = is_locale(clean_segment);

	if (is_locale_segment) segments[0] = locale;
	else segments.unshift(locale);

	return `${base_path}/${segments.join('/')}`;
}

function format_date(locale: Locale, value: string | Date): string {
	if (!value) return '';
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	const intl_locale = locale === 'ar' ? 'ar' : 'en';
	return new Intl.DateTimeFormat(intl_locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	}).format(date);
}

export {
	base_url,
	build_path_for_locale,
	format_date,
	is_locale,
	type Locale,
	locale_from_path,
	messages,
	translate
};
