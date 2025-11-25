// src/routes/api/analytics/+server.ts
import { json } from '@sveltejs/kit';
import { fetchTwitterData } from '$lib/server/twitter';
import { analyzeProfile } from '$lib/server/analytics'; // Import file mới tạo

export const GET = async ({ url }) => {
    const handle = url.searchParams.get('handle');
    if (!handle) return json({ error: 'Handle required' }, { status: 400 });

    try {
        // 1. Lấy dữ liệu (Giữ nguyên flow)
        const { profile, tweets, pinnedTweet } = await fetchTwitterData(handle);

        // 2. Tính toán (Thay AI bằng Logic thống kê)
        const insights = analyzeProfile(tweets, profile);

        // 3. Trả về JSON (Frontend sẽ nhận cục này)
        return json(insights);

    } catch (error: any) {
        console.error("Analytics Error:", error);
        return json({ error: error.message }, { status: 500 });
    }
};
