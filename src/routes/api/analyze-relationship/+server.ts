// src/routes/api/analyze-relationship/+server.ts
import { json } from '@sveltejs/kit';
import { analyzeRelationship } from '$lib/server/twitter';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    // 1. Bắt buộc đăng nhập mới được dùng (để tránh spam API)
    if (!locals.user) {
        return json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const body = await request.json();
    const { handleA, handleB } = body;

    // 2. Validate input
    if (!handleA || !handleB) {
        return json({ error: 'Missing handles' }, { status: 400 });
    }

    // Clean handle (bỏ @, khoảng trắng)
    const cleanA = handleA.toString().replace('@', '').trim();
    const cleanB = handleB.toString().replace('@', '').trim();

    try {
        console.log(`[API] Checking mutuals: ${cleanA} vs ${cleanB}`);
        
        // 3. Gọi hàm xử lý logic
        const result = await analyzeRelationship(cleanA, cleanB);

        return json({
            success: true,
            data: result
        });

    } catch (e: any) {
        console.error("[API] Relationship Error:", e);
        return json({ 
            success: false, 
            message: e.message || 'Failed to analyze relationship' 
        }, { status: 500 });
    }
};
