// src/routes/report/[handle]/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
    // 1. BẮT BUỘC LOGIN
    if (!locals.user) {
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }

    // Trả về handle để client biết mà fetch
    return {
        targetHandle: params.handle
    };
};
