// src/lib/server/ai.ts
import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import type { AITopic } from '$lib/types';

const groq = new Groq({ apiKey: GROQ_API_KEY });


export async function analyzeTopics(tweets: { text: string }[]): Promise<AITopic[]> {
    // Lọc bớt data rác để tiết kiệm token
    const docs = tweets
        .filter(t => !t.text.startsWith('RT @')) // Bỏ Retweet
        .slice(0, 40) // Lấy 40 bài gần nhất để phân tích
        .map(t => t.text.replace(/\n/g, ' ').substring(0, 200)); // Cắt ngắn bớt

    if (docs.length === 0) return [];

    const prompt = `
    Analyze these tweets and extract the top 8-12 main topics/keywords for a Tag Cloud.
    
    Rules:
    1. Group similar concepts (e.g., "coding", "dev", "programming" -> "Coding").
    2. "text": Short label (max 2 words, Title Case).
    3. "count": Estimate relative importance (1-10 scale) based on frequency.
    4. "type": Use "hashtag" if it often appears with #, otherwise "keyword".
    
    Tweets:
    ${JSON.stringify(docs)}

    Return ONLY a JSON object: { "topics": [{ "text": "...", "count": 5, "type": "keyword" }] }
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            
            // [!code highlight] BÍ KÍP CHỐNG LOẠN XẠ KHI F5
            temperature: 0,      // Ép AI "nghiêm túc", không sáng tạo linh tinh
            seed: 42,            // Con số may mắn, giúp output ổn định (Deterministic)
            
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return [];

        const res = JSON.parse(content);
        return res.topics || [];

    } catch (error) {
        console.error('AI Topic Error:', error);
        return []; // Trả về rỗng để fallback sang logic thủ công
    }
}
