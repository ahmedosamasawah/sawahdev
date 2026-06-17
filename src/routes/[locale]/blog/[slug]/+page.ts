import { error } from '@sveltejs/kit';

import { blog_posts } from '$lib/data/blog';
import { is_locale } from '$lib/i18n/runtime';

import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	blog_posts.map((post) => ({ locale: post.locale, slug: post.slug }));

export const load: PageLoad = ({ params }) => {
	if (!is_locale(params.locale)) error(404, 'Page not found');
	if (!blog_posts.some((post) => post.locale === params.locale && post.slug === params.slug)) {
		error(404, 'Post not found');
	}

	return {
		locale: params.locale,
		slug: params.slug
	};
};
