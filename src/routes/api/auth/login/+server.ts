// src/routes/api/auth/login/+server.ts
import { adminAuth, db } from '$lib/server/firebase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();
	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

	try {
		// 1. Tạo session cookie từ ID Token
		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// 2. LOGIC FIRESTORE: Kiểm tra và tạo user profile nếu chưa có
		const userRef = db.collection('user_profile').doc(uid);
		const userSnap = await userRef.get();

		if (!userSnap.exists) {
			await userRef.set({
				uid: uid,
				email: decodedToken.email,
				name: decodedToken.name || 'Anonymous',
				avatarUrl: decodedToken.picture || '',
				createdAt: new Date(),
				credits: 5,           // Tặng 5 credits mặc định
				analysisCount: 10,    // Tặng 10 lượt phân tích
				isPremium: false
			});
			console.log(`Created new profile for user: ${uid}`);
		}

		// 3. Set Cookie
		cookies.set('session', sessionCookie, {
			maxAge: expiresIn / 1000, // sveltekit dùng seconds
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			sameSite: 'lax'
		});

		return json({ status: 'success' });
	} catch (error) {
		console.error(error);
		return json({ status: 'error' }, { status: 401 });
	}
};
