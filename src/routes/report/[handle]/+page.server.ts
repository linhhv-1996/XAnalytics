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


const fake = {
    "profile": {
        "handle": "@aiktp_com",
        "name": "John Lee KTP",
        "bio": "Founder of https://t.co/4C7dY9pg8j (AI SEO & TTS) and https://t.co/n8VT0PvmY5 – helping X creators grow faster with AI.",
        "avatarUrl": "https://pbs.twimg.com/profile_images/1947415345524051968/eA_aT485_normal.jpg",
        "banner": "https://pbs.twimg.com/profile_banners/1614014268667736064/1748569270",
        "followers": "11K",
        "following": "2.2K",
        "tweetsCount": "61K",
        "engagement": "5.6%",
        "viralRatio": "1:100",
        "grade": "A+"
    },
    "overview": {
        "totalEngagement": 6043,
        "avgEngagementRate": 5.6,
        "viralRate": 0
    },
    "contentStrategy": {
        "threadRatio": 0,
        "visualRatio": 89,
        "promoRatio": 58,
        "monetization": {
            "valueCount": 8,
            "promoCount": 11,
            "valueRatio": 42,
            "promoRatio": 58,
            "frequency": "Sells every ~2 posts"
        },
        "length": {
            "short": {
                "count": 1,
                "totalViews": 5901,
                "avgViews": 5901,
                "score": 1
            },
            "medium": {
                "count": 7,
                "totalViews": 37324,
                "avgViews": 5332,
                "score": 0.9
            },
            "long": {
                "count": 11,
                "totalViews": 64592,
                "avgViews": 5872,
                "score": 1
            },
            "bestType": "Short"
        }
    },
    "funnel": {
        "viewToLike": 3.89,
        "viewToReply": 1.47,
        "viewToFan": 1.59
    },
    "topContent": {
        "mostViral": {
            "id": "1989812928082841934",
            "type": "single",
            "text": "I grew from 0 to 9,000 followers in 30 days using one simple tool.\n\nIn this video, I reveal exactly how https://t.co/LcQuJBwj3u helped me boost engagement and grow fast on X.\n\nTry it yourself and see the difference. If you find this helpful, give me a like or a heart ❤️ https://t.co/cvcAvppigy",
            "createdAt": "Sat Nov 15 21:49:05 +0000 2025",
            "views": 10546,
            "likes": 363,
            "retweets": 10,
            "replies": 170,
            "bookmarks": 25,
            "isReply": false,
            "hasMedia": true,
            "mediaType": "video",
            "url": "https://x.com/aiktp_com/status/1989812928082841934",
            "outboundLinks": [
                "http://EngageX.click"
            ],
            "hashtags": [],
            "mentions": [],
            "threadChildren": []
        },
        "mostDiscussion": {
            "id": "1984762284204540370",
            "type": "single",
            "text": "Hello, Good morning X",
            "createdAt": "Sat Nov 01 23:19:38 +0000 2025",
            "views": 5901,
            "likes": 307,
            "retweets": 5,
            "replies": 188,
            "bookmarks": 3,
            "isReply": false,
            "hasMedia": false,
            "mediaType": "none",
            "url": "https://x.com/aiktp_com/status/1984762284204540370",
            "outboundLinks": [],
            "hashtags": [],
            "mentions": [],
            "threadChildren": []
        },
        "hiddenGem": {
            "id": "1982656036902478034",
            "type": "single",
            "text": "Big update 🚀\nYou can now create stunning AI images right inside the platform.\nWrite + Generate visuals in seconds.\nSo easy — go try it!\n\nhttps://t.co/kBXcdaEaVS https://t.co/LKP2Dh2eFz",
            "createdAt": "Mon Oct 27 03:50:09 +0000 2025",
            "views": 3171,
            "likes": 213,
            "retweets": 4,
            "replies": 90,
            "bookmarks": 4,
            "isReply": false,
            "hasMedia": true,
            "mediaType": "image",
            "url": "https://x.com/aiktp_com/status/1982656036902478034",
            "outboundLinks": [
                "http://aiktp.com/booster"
            ],
            "hashtags": [],
            "mentions": [],
            "threadChildren": []
        },
        "list": [
            {
                "text": "I grew from 0 to 9,000 followers in 30 days using one simple tool.\n\nIn this video, I reveal exactly how https://t.co/LcQuJBwj3u helped me boost engagement and grow fast on X.\n\nTry it yourself and see the difference. If you find this helpful, give me a like or a heart ❤️ https://t.co/cvcAvppigy",
                "views": "11K",
                "likes": "363",
                "replies": "170",
                "date": "Nov 16",
                "url": "https://x.com/aiktp_com/status/1989812928082841934"
            },
            {
                "text": "🚀 Want to grow your X followers fast? The secret is cross engagement!\nLearn how to:\n✅ Find active KOLs in your niche\n✅ Comment strategically to get noticed\n✅ Manage your follower growth efficiently\n💡Using these strategies, many users gained 10,000+ followers in just 30 days!… https://t.co/5wOqKPhCOb",
                "views": "9.3K",
                "likes": "255",
                "replies": "105",
                "date": "Nov 19",
                "url": "https://x.com/aiktp_com/status/1991068782136320101"
            },
            {
                "text": "You want to do SEO but don’t have time?\nYou want to write fast, SEO-optimized content and publish everywhere in just a few clicks?\n\nHere’s the solution: Plan – Write – Boost 🚀\n\n✅ PLAN – Smart keyword planning with AI\n✅ WRITE – SEO-optimized content in seconds\n✅ BOOST –… https://t.co/JtKHs2dgAh",
                "views": "9K",
                "likes": "223",
                "replies": "74",
                "date": "Nov 3",
                "url": "https://x.com/aiktp_com/status/1985277307880403057"
            }
        ]
    },
    "network": {
        "topMentions": []
    },
    "topics": {
        "list": [
            {
                "text": "Grow",
                "count": 7,
                "type": "keyword"
            },
            {
                "text": "Boost",
                "count": 7,
                "type": "keyword"
            },
            {
                "text": "Write",
                "count": 6,
                "type": "keyword"
            },
            {
                "text": "Engagement",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Followers",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Fast",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Communities",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Seconds",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Content",
                "count": 5,
                "type": "keyword"
            },
            {
                "text": "Comment",
                "count": 4,
                "type": "keyword"
            },
            {
                "text": "Using",
                "count": 4,
                "type": "keyword"
            },
            {
                "text": "Hours",
                "count": 4,
                "type": "keyword"
            },
            {
                "text": "Writing",
                "count": 4,
                "type": "keyword"
            },
            {
                "text": "Real",
                "count": 3,
                "type": "keyword"
            },
            {
                "text": "Active",
                "count": 3,
                "type": "keyword"
            }
        ]
    },
    "traffic": {
        "topDomains": [
            {
                "domain": "engagex.click",
                "count": 6
            },
            {
                "domain": "aiktp.com",
                "count": 2
            },
            {
                "domain": "megallm.io",
                "count": 1
            },
            {
                "domain": "s.engagex.click",
                "count": 1
            },
            {
                "domain": "Gumroad",
                "count": 1
            }
        ]
    },
    "habits": {
        "bestHour": "8:00",
        "bestHourMetric": "9.3K avg views",
        "postingSchedule": [],
        "heatmap": [
            {
                "date": "Oct 23",
                "fullDate": "2025-10-23",
                "count": 0,
                "level": 0
            },
            {
                "date": "Oct 24",
                "fullDate": "2025-10-24",
                "count": 0,
                "level": 0
            },
            {
                "date": "Oct 25",
                "fullDate": "2025-10-25",
                "count": 1,
                "level": 1
            },
            {
                "date": "Oct 26",
                "fullDate": "2025-10-26",
                "count": 1,
                "level": 1
            },
            {
                "date": "Oct 27",
                "fullDate": "2025-10-27",
                "count": 1,
                "level": 1
            },
            {
                "date": "Oct 28",
                "fullDate": "2025-10-28",
                "count": 1,
                "level": 1
            },
            {
                "date": "Oct 29",
                "fullDate": "2025-10-29",
                "count": 0,
                "level": 0
            },
            {
                "date": "Oct 30",
                "fullDate": "2025-10-30",
                "count": 1,
                "level": 1
            },
            {
                "date": "Oct 31",
                "fullDate": "2025-10-31",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 1",
                "fullDate": "2025-11-01",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 2",
                "fullDate": "2025-11-02",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 3",
                "fullDate": "2025-11-03",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 4",
                "fullDate": "2025-11-04",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 5",
                "fullDate": "2025-11-05",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 6",
                "fullDate": "2025-11-06",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 7",
                "fullDate": "2025-11-07",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 8",
                "fullDate": "2025-11-08",
                "count": 2,
                "level": 2
            },
            {
                "date": "Nov 9",
                "fullDate": "2025-11-09",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 10",
                "fullDate": "2025-11-10",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 11",
                "fullDate": "2025-11-11",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 12",
                "fullDate": "2025-11-12",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 13",
                "fullDate": "2025-11-13",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 14",
                "fullDate": "2025-11-14",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 15",
                "fullDate": "2025-11-15",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 16",
                "fullDate": "2025-11-16",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 17",
                "fullDate": "2025-11-17",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 18",
                "fullDate": "2025-11-18",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 19",
                "fullDate": "2025-11-19",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 20",
                "fullDate": "2025-11-20",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 21",
                "fullDate": "2025-11-21",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 22",
                "fullDate": "2025-11-22",
                "count": 1,
                "level": 1
            },
            {
                "date": "Nov 23",
                "fullDate": "2025-11-23",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 24",
                "fullDate": "2025-11-24",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 25",
                "fullDate": "2025-11-25",
                "count": 0,
                "level": 0
            },
            {
                "date": "Nov 26",
                "fullDate": "2025-11-26",
                "count": 0,
                "level": 0
            }
        ],
        "hourlyPerf": [
            {
                "hour": 0,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 1,
                "avgViews": 4265,
                "postCount": 3,
                "score": 46
            },
            {
                "hour": 2,
                "avgViews": 6739,
                "postCount": 2,
                "score": 72
            },
            {
                "hour": 3,
                "avgViews": 2860,
                "postCount": 2,
                "score": 31
            },
            {
                "hour": 4,
                "avgViews": 5457,
                "postCount": 2,
                "score": 59
            },
            {
                "hour": 5,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 6,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 7,
                "avgViews": 3533,
                "postCount": 1,
                "score": 38
            },
            {
                "hour": 8,
                "avgViews": 9321,
                "postCount": 1,
                "score": 100
            },
            {
                "hour": 9,
                "avgViews": 6721,
                "postCount": 4,
                "score": 72
            },
            {
                "hour": 10,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 11,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 12,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 13,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 14,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 15,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 16,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 17,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 18,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 19,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 20,
                "avgViews": 0,
                "postCount": 0,
                "score": 0
            },
            {
                "hour": 21,
                "avgViews": 8302,
                "postCount": 2,
                "score": 89
            },
            {
                "hour": 22,
                "avgViews": 2668,
                "postCount": 1,
                "score": 29
            },
            {
                "hour": 23,
                "avgViews": 5901,
                "postCount": 1,
                "score": 63
            }
        ]
    },
    "baseline": {
        "views": 5901,
        "likes": 220,
        "engagement": 5.83,
        "viralRate": 0,
        "viewsScore": 56,
        "likesScore": 61,
        "engagementScore": 59,
        "viralScore": 5
    },
    "signal": {
        "title": "Signal Snapshot",
        "type": "Top Signal",
        "text": "I grew from 0 to 9,000 followers in 30 days using one simple tool.\n\nIn this video, I reveal exactly how https://t.co/LcQuJBwj3u helped me boost engagement and grow fast on X.\n\nTry it yourself and see the difference. If you find this helpful, give me a like or a heart ❤️ https://t.co/cvcAvppigy",
        "createdAt": "Nov 16, 2025",
        "likes": "363",
        "replies": "170",
        "views": "11K",
        "multiplier": "1.8×",
        "url": "https://x.com/aiktp_com/status/1989812928082841934",
        "hasMedia": true,
        "mediaType": "video"
    },
    "replyStrategy": {
        "replyCount": 20,
        "avgLength": 54,
        "archetype": "Supporter",
        "metrics": {
            "spamScore": 15,
            "valueScore": 5,
            "neutralScore": 80
        },
        "topTargets": [
            {
                "count": 2,
                "avatar": "https://pbs.twimg.com/profile_images/1883886015959400448/kGOwuKkN_normal.jpg",
                "handle": "lagattke"
            },
            {
                "count": 2,
                "avatar": "https://pbs.twimg.com/profile_images/1856119974558883840/M5v-36xt_normal.jpg",
                "handle": "SalimoAnne"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1924017172319236096/q4FY02eV_normal.jpg",
                "handle": "impeculiar1b"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1956800902725345280/SkB98Squ_normal.jpg",
                "handle": "fuelxmeta"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1939617186949054464/PZR_-us2_normal.jpg",
                "handle": "fyrechartz"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1946240793615761408/fezsZaeG_normal.jpg",
                "handle": "JJXMeta"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1433030583144390668/FKJ9JkUA_normal.jpg",
                "handle": "rustybrick"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1953748435258966016/ET4CB49s_normal.jpg",
                "handle": "misscaramelgold"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1288449070344937473/fKlvccnM_normal.jpg",
                "handle": "thisiskp_"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1869287109925785600/YWZDr58H_normal.jpg",
                "handle": "Mazi_Chinonso1"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1869287109925785600/YWZDr58H_normal.jpg",
                "handle": "Mazi_Chinonso1"
            },
            {
                "count": 1,
                "avatar": "https://pbs.twimg.com/profile_images/1869287109925785600/YWZDr58H_normal.jpg",
                "handle": "Mazi_Chinonso1"
            }
        ]
    }
}
