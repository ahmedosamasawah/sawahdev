import { error } from '@sveltejs/kit';

import { is_locale } from '$lib/i18n/runtime';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (!is_locale(params.locale)) error(404, 'Page not found');

	return { locale: params.locale };
};
