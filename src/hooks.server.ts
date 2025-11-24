// src/hooks.server.ts
import { adminAuth } from '$lib/server/firebase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');

	if (!sessionCookie) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
		event.locals.user = {
			uid: decodedClaims.uid,
			email: decodedClaims.email,
			picture: decodedClaims.picture,
			name: decodedClaims.name
		};
	} catch (e) {
		event.locals.user = null;
	}

	return resolve(event);
};
