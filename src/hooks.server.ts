import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const is_ar = event.url.pathname.split('/').includes('ar');

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%lang%', is_ar ? 'ar' : 'en').replace('%dir%', is_ar ? 'rtl' : 'ltr')
	});
};
