import { error } from '@sveltejs/kit';

import { projects } from '$lib/data/projects';
import { is_locale } from '$lib/i18n/runtime';

import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	projects
		.filter((project) => project.hasDetailPage)
		.flatMap((project) => ['en', 'ar'].map((locale) => ({ locale, id: project.id })));

export const load: PageLoad = ({ params }) => {
	if (!is_locale(params.locale)) error(404, 'Page not found');
	if (!projects.some((project) => project.id === params.id && project.hasDetailPage)) {
		error(404, 'Project not found');
	}

	return {
		locale: params.locale,
		id: params.id
	};
};
