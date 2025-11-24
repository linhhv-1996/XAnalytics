// src/lib/server/ai.ts
import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import type { AnalyzedTopic, ArchetypeResult } from '$lib/types';

const groq = new Groq({
    apiKey: GROQ_API_KEY
});

export interface PinnedPostAnalysis {
    goal: string;        // Mục tiêu chính (Drive sales, Newsletter...)
    type: string;        // Loại bài (Thread, Launch, Personal Story...)
    clickThrough: string; // Ước tính CTR (High ~2%, Low <1%...)
}

export async function analyzePinnedPost(tweetText: string): Promise<PinnedPostAnalysis> {
    if (!tweetText) {
        return { goal: "N/A", type: "N/A", clickThrough: "N/A" };
    }

    const prompt = `
        Analyze this pinned tweet text and return a JSON object with 3 fields:
        1. "goal": The main marketing goal (max 5 words, e.g., "Drive Newsletter Signups", "Build Authority").
        2. "type": The format/style (max 4 words, e.g., "Educational Thread", "Product Launch", "Personal Story").
        3. "clickThrough": Estimate click-through rate based on hook quality (e.g., "~1.5% (High)", "~0.5% (Avg)", "N/A (No link)").

        Tweet: "${tweetText.replace(/"/g, "'").slice(0, 500)}"
        
        Return ONLY raw JSON. No markdown, no explanation.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            seed: 2411,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No content from AI');

        return JSON.parse(content) as PinnedPostAnalysis;

    } catch (error) {
        console.error('AI Error:', error);
        return {
            goal: "General Engagement",
            type: "Standard Tweet",
            clickThrough: "Unknown"
        };
    }
}


export async function analyzeTopics(tweets: { id: string; text: string }[]): Promise<AnalyzedTopic[]> {
    if (!tweets || tweets.length < 5) return [];

    // Chỉ lấy tối đa 30 bài để tiết kiệm token
    const sample = tweets.slice(0, 30);
    
    const prompt = `
    Analyze the following tweets and group them into 3 to 5 distinct content topics (categories).
    
    Rules:
    1. Topic names must be short (max 3 words, e.g., "Coding Tips", "Personal Stories").
    2. Description must be short (max 10 words).
    3. Return a JSON object with a "topics" array. Each item must have: "name", "description", and "tweetIds" (array of exact IDs from input).
    4. Ensure every tweet ID belongs to exactly one topic.

    Input Data:
    ${JSON.stringify(sample)}

    Return ONLY raw JSON.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            seed: 2411,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No content');

        const result = JSON.parse(content);
        return result.topics || [];

    } catch (error) {
        console.error('AI Topic Analysis Error:', error);
        return [];
    }
}


export async function analyzeArchetype(tweetTexts: string[]): Promise<ArchetypeResult> {
    if (!tweetTexts || tweetTexts.length === 0) {
        return {
            name: "N/A",
            match_score: 0,
            aggression: 0,
            polarization: 0,
            description: "Not enough data to analyze."
        };
    }

    // Chỉ lấy tối đa 20 bài để tiết kiệm token nhưng vẫn đủ context
    const sampleText = tweetTexts.slice(0, 20).join("\n---\n");

const prompt = `
    Act as a social media psychologist. I will provide a list of tweets from a SINGLE user.
    Your task is to analyze their *overall* personality and writing style to build a SINGLE profile.
    
    🚨 IMPORTANT: Do NOT analyze individual tweets. Return ONLY ONE JSON object representing the user's dominant persona.

    Potential Archetypes to choose from: 
    - "The Builder" (Builds in public, shares lessons, humble, transparent)
    - "The Contrarian" (Goes against crowd, provocative, critical, "unpopular opinion")
    - "The Educator" (Step-by-step guides, neutral tone, helpful, long threads)
    - "The Motivator" (Platitudes, high energy, hustle culture, short punchy lines)
    - "The Shitposter" (Memes, sarcasm, not serious, lowercased, trolling)
    - "The Philosopher" (Abstract thoughts, observational, deep questions)
    - "The Reporter" (News aggregation, neutral, just facts)
    
    Return a SINGLE JSON object with this exact structure:
    {
        "name": "The best fit archetype name from the list above",
        "match_score": 0-100 (Integer. How consistent is their tone across all tweets?),
        "aggression": 0-100 (Integer. Overall hostility level),
        "polarization": 0-100 (Integer. Overall controversy/"us vs them" level),
        "description": "A sharp, 1-sentence analysis of their overall tone (max 20 words)."
    }

    Tweets to analyze:
    ${sampleText}

    Return ONLY raw JSON. No markdown formatting.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            seed: 2411,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No content');
        const res = JSON.parse(content) as ArchetypeResult;
        console.log(res);
        return res;

    } catch (error) {
        console.error('AI Archetype Error:', error);
        return {
            name: "N/A",
            match_score: 0,
            aggression: 0,
            polarization: 0,
            description: "Unable to analyze tone at this moment."
        };
    }
}
