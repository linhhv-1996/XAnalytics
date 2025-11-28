// src/routes/api/analyze-profile/+server.ts
import { json, error } from '@sveltejs/kit';
import { fetchTwitterData, fetchVipConnections } from '$lib/server/twitter';
import { analyzeProfile } from '$lib/server/analytics';
import type { RequestHandler } from './$types';
import { logData } from '$lib/server/debug';

export const POST: RequestHandler = async ({ request, locals, setHeaders }) => {
    // 1. Check Login
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const handle = body.handle;

    if (!handle) {
        return json({ error: 'Missing handle' }, { status: 400 });
    }

    try {
        console.log(`[API] Analyzing: ${handle}`);

        // 2. Fetch dữ liệu
        const { profile, tweets, pinnedTweet, reply } = await fetchTwitterData(handle);

        // 3. Phân tích
        const insights = analyzeProfile(tweets, pinnedTweet, reply, profile);

        // 4. Following
        const vipNetwork = await fetchVipConnections(profile.handle);

        // 4. Cache Control (Client side cache 5 phút)
        // setHeaders({
        //     'cache-control': 'private, max-age=300'
        // });

        const analyticsData = {
            ...insights,
            network: {
                topMentions: insights.network.topMentions,
                vipFollowing: vipNetwork
            }
        };


        logData("sample-data.log", analyticsData);


        // const analyticsData = {
        //     "profile": {
        //         "handle": "@marclou",
        //         "name": "Marc Lou",
        //         "bio": "🧑‍💻 https://t.co/Y30jsaHwz9 $20K/m\n⚡️ https://t.co/vatLDmi9UG $17K/m\n📈 https://t.co/3EDxln5mdi $16K/m\n⭐️ https://t.co/MZc8tG9xWi $8K/m\n🧬 https://t.co/SfrVXVtmdA $.5K/m\n🍜 https://t.co/r07EpGSYJ2 $0K/m\n🧾 https://t.co/7olaOzV8Xd $0/m\n\n+18 https://t.co/4zCWHGJp1S",
        //         "avatarUrl": "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_normal.jpg",
        //         "banner": "https://pbs.twimg.com/profile_banners/2311987360/1708675367",
        //         "followers": "239K",
        //         "following": "1.1K",
        //         "tweetsCount": "30K",
        //         "engagement": "0.59%",
        //         "viralRatio": "1:6",
        //         "grade": "C"
        //     },
        //     "overview": {
        //         "totalEngagement": 21853,
        //         "avgEngagementRate": 0.59,
        //         "viralRate": 15.6
        //     },
        //     "contentStrategy": {
        //         "threadRatio": 60,
        //         "visualRatio": 71,
        //         "promoRatio": 33,
        //         "monetization": {
        //             "valueCount": 30,
        //             "promoCount": 15,
        //             "valueRatio": 67,
        //             "promoRatio": 33,
        //             "frequency": "Sells every ~3 posts"
        //         },
        //         "length": {
        //             "short": {
        //                 "count": 17,
        //                 "totalViews": 1248077,
        //                 "avgViews": 73416,
        //                 "score": 1.6
        //             },
        //             "medium": {
        //                 "count": 6,
        //                 "totalViews": 368657,
        //                 "avgViews": 61443,
        //                 "score": 1.3
        //             },
        //             "long": {
        //                 "count": 22,
        //                 "totalViews": 2081967,
        //                 "avgViews": 94635,
        //                 "score": 2
        //             },
        //             "bestType": "Long"
        //         }
        //     },
        //     "funnel": {
        //         "viewToLike": 0.4,
        //         "viewToReply": 0.08,
        //         "viewToFan": 0.18
        //     },
        //     "topContent": {
        //         "mostViral": {
        //             "id": "1992938024741830708",
        //             "type": "thread",
        //             "text": "Startup revenue vs. Founder 𝕏 followers\n\nn=1000 https://t.co/4rbRXmLY65",
        //             "createdAt": "Mon Nov 24 12:47:06 +0000 2025",
        //             "views": 408807,
        //             "likes": 813,
        //             "retweets": 39,
        //             "replies": 167,
        //             "bookmarks": 203,
        //             "isReply": false,
        //             "hasMedia": true,
        //             "mediaType": "image",
        //             "url": "https://x.com/marclou/status/1992938024741830708",
        //             "outboundLinks": [],
        //             "hashtags": [],
        //             "mentions": [],
        //             "threadChildren": [
        //                 {
        //                     "id": "1993050717167489400",
        //                     "type": "reply",
        //                     "text": "fixed (now i go sleep)\nhttps://t.co/2Yz5qSW477 https://t.co/AKdxAOQvWh",
        //                     "createdAt": "Mon Nov 24 20:14:54 +0000 2025",
        //                     "views": 22197,
        //                     "likes": 78,
        //                     "retweets": 4,
        //                     "replies": 12,
        //                     "bookmarks": 13,
        //                     "isReply": true,
        //                     "hasMedia": true,
        //                     "mediaType": "image",
        //                     "url": "https://x.com/marclou/status/1993050717167489400",
        //                     "outboundLinks": [
        //                         "https://x.com/iamgdsa/status/1992947694470611373?s=20"
        //                     ],
        //                     "hashtags": [],
        //                     "mentions": [],
        //                     "threadChildren": []
        //                 }
        //             ]
        //         },
        //         "mostDiscussion": {
        //             "id": "1993318636954722400",
        //             "type": "thread",
        //             "text": "Thinking out loud:\n\nI'm trying to monetize TrustMRR beyond just using ads.\n\nThe platform has $1.2 billion of verified startup revenue, and processes $500,000 worth of transactions per day.\n\nThere might be value somewhere for someone? Meeting a cofounder, posting job offers,… https://t.co/kxvhshT4n0",
        //             "createdAt": "Tue Nov 25 13:59:31 +0000 2025",
        //             "views": 93335,
        //             "likes": 528,
        //             "retweets": 13,
        //             "replies": 202,
        //             "bookmarks": 147,
        //             "isReply": false,
        //             "hasMedia": true,
        //             "mediaType": "image",
        //             "url": "https://x.com/marclou/status/1993318636954722400",
        //             "outboundLinks": [],
        //             "hashtags": [],
        //             "mentions": [],
        //             "threadChildren": [
        //                 {
        //                     "id": "1993415687239315907",
        //                     "type": "reply",
        //                     "text": "There are too many great and crazy ideas, summarize for me @grok",
        //                     "createdAt": "Tue Nov 25 20:25:10 +0000 2025",
        //                     "views": 16072,
        //                     "likes": 15,
        //                     "retweets": 1,
        //                     "replies": 6,
        //                     "bookmarks": 3,
        //                     "isReply": true,
        //                     "hasMedia": false,
        //                     "mediaType": "none",
        //                     "url": "https://x.com/marclou/status/1993415687239315907",
        //                     "outboundLinks": [],
        //                     "hashtags": [],
        //                     "mentions": [
        //                         "grok"
        //                     ],
        //                     "threadChildren": []
        //                 }
        //             ]
        //         },
        //         "hiddenGem": {
        //             "id": "1993594300551381076",
        //             "type": "thread",
        //             "text": "Gemini is cooking \n\nEyes on the surf \n\nWhen the tide shifts, I’m out there https://t.co/NDrwkBrjY5",
        //             "createdAt": "Wed Nov 26 08:14:55 +0000 2025",
        //             "views": 25305,
        //             "likes": 505,
        //             "retweets": 12,
        //             "replies": 87,
        //             "bookmarks": 31,
        //             "isReply": false,
        //             "hasMedia": true,
        //             "mediaType": "image",
        //             "url": "https://x.com/marclou/status/1993594300551381076",
        //             "outboundLinks": [],
        //             "hashtags": [],
        //             "mentions": [],
        //             "threadChildren": [
        //                 {
        //                     "id": "1993622741006840279",
        //                     "type": "reply",
        //                     "text": "Its time for IRL https://t.co/y3S3dUiqee",
        //                     "createdAt": "Wed Nov 26 10:07:55 +0000 2025",
        //                     "views": 5602,
        //                     "likes": 31,
        //                     "retweets": 0,
        //                     "replies": 4,
        //                     "bookmarks": 1,
        //                     "isReply": true,
        //                     "hasMedia": true,
        //                     "mediaType": "image",
        //                     "url": "https://x.com/marclou/status/1993622741006840279",
        //                     "outboundLinks": [],
        //                     "hashtags": [],
        //                     "mentions": [],
        //                     "threadChildren": []
        //                 }
        //             ]
        //         },
        //         "list": [
        //             {
        //                 "text": "Startup revenue vs. Founder 𝕏 followers\n\nn=1000 https://t.co/4rbRXmLY65",
        //                 "views": "409K",
        //                 "likes": "813",
        //                 "replies": "167",
        //                 "date": "Nov 24",
        //                 "url": "https://x.com/marclou/status/1992938024741830708"
        //             },
        //             {
        //                 "text": "Startup pages on TrustMRR now show founder's 𝕏 followers count ✨ https://t.co/MNayUj7vpQ",
        //                 "views": "275K",
        //                 "likes": "174",
        //                 "replies": "49",
        //                 "date": "Nov 22",
        //                 "url": "https://x.com/marclou/status/1992236792444309836"
        //             },
        //             {
        //                 "text": "I just added a startup revenue globe 🌍 https://t.co/VcZf7syWWZ",
        //                 "views": "266K",
        //                 "likes": "420",
        //                 "replies": "71",
        //                 "date": "Nov 24",
        //                 "url": "https://x.com/marclou/status/1992892728653279256"
        //             }
        //         ]
        //     },
        //     "network": {
        //         "topMentions": [
        //             {
        //                 "handle": "dodopayments",
        //                 "count": 4
        //             },
        //             {
        //                 "handle": "nikitabier",
        //                 "count": 3
        //             },
        //             {
        //                 "handle": "nomistair",
        //                 "count": 2
        //             },
        //             {
        //                 "handle": "greg_rog",
        //                 "count": 2
        //             },
        //             {
        //                 "handle": "khushxxl",
        //                 "count": 1
        //             }
        //         ],
        //         "vipFollowing": [
        //             {
        //                 "handle": "Jason",
        //                 "name": "@jason",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1828870492633104384/o37xorx4_normal.jpg",
        //                 "description": "first investor in https://t.co/M6cblbFld9 Host: @twistartups @theallinpod; I also invest in 100 startups a year @launch & @founderuni jason@calacanis.com for life",
        //                 "followers": 1034278,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "PeterAttiaMD",
        //                 "name": "Peter Attia",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1887223171494948864/upGIlnVZ_normal.jpg",
        //                 "description": "Former national level tic-tac-toe player. Still play for fun, but not quite as good. Also, play a LOT of Uno.",
        //                 "followers": 513335,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "Austen",
        //                 "name": "Austen Allred",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1608281295918096385/D2kh-M28_normal.jpg",
        //                 "description": "Founder https://t.co/m6TigM4CJT: Free AI training for the smartest engineers in the world. Will tweet as I wish and suffer the consequences.",
        //                 "followers": 431783,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "tobi",
        //                 "name": "tobi lutke",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1782528087009251328/qDwzHe5q_normal.jpg",
        //                 "description": "@Shopify CEO by day, Dad in evening, hacker at night. Aspiring comprehensivist. (tweets auto delete eventually) retweet=noteworthy share, not endorsement",
        //                 "followers": 428782,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "StevenBartlett",
        //                 "name": "Steven Bartlett",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1979133750467305472/d7WuSn42_normal.jpg",
        //                 "description": "Founder of https://t.co/XxTAZe3Ls6 - The Creator Company. Co-Founder of @thirdweb. Investor in @SpaceX, @Mrbeast, Groq + 50 more. The Diary Of A CEO. Dragons Den!",
        //                 "followers": 350227,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "minchoi",
        //                 "name": "Min Choi",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1638359113221517312/CBZaJFyA_normal.jpg",
        //                 "description": "AI Educator. 𝕏 about AI, solutions and interesting things.  Showing how to leverage AI in practical ways for you and your business. Opinions are my own.",
        //                 "followers": 330517,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "Xavier75",
        //                 "name": "Xavier Niel",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1846919134837141504/SFkaCgbT_normal.jpg",
        //                 "description": "Free, iliad, 42, Station F, Kima Ventures, Hectar, Kyutai …",
        //                 "followers": 323057,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "banteg",
        //                 "name": "banteg",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1406018339835678720/fLQOnMbp_normal.jpg",
        //                 "description": "the bunny talisman of yearn",
        //                 "followers": 214422,
        //                 "isVerified": true
        //             },
        //             {
        //                 "handle": "pitdesi",
        //                 "name": "Sheel Mohnot",
        //                 "avatar": "https://pbs.twimg.com/profile_images/1677703475994542081/L6D7mFUc_normal.jpg",
        //                 "description": "Posting stuff I find interesting.\nWork: @btv_vc, leading pre/seed rounds of fintech cos. \nAlways up for adventure.",
        //                 "followers": 182597,
        //                 "isVerified": true
        //             }
        //         ]
        //     },
        //     "topics": {
        //         "list": [
        //             {
        //                 "text": "Revenue",
        //                 "count": 21,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Startup",
        //                 "count": 17,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Trustmrr",
        //                 "count": 16,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Followers",
        //                 "count": 15,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Founders",
        //                 "count": 7,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Made",
        //                 "count": 5,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Spend",
        //                 "count": 5,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Test",
        //                 "count": 5,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Learn",
        //                 "count": 5,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Added",
        //                 "count": 4,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Startups",
        //                 "count": 4,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Next",
        //                 "count": 4,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Days",
        //                 "count": 4,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Soon",
        //                 "count": 4,
        //                 "type": "keyword"
        //             },
        //             {
        //                 "text": "Wake",
        //                 "count": 4,
        //                 "type": "keyword"
        //             }
        //         ]
        //     },
        //     "traffic": {
        //         "topDomains": [
        //             {
        //                 "domain": "trustmrr.com",
        //                 "count": 12
        //             },
        //             {
        //                 "domain": "datafa.st",
        //                 "count": 2
        //             }
        //         ]
        //     },
        //     "habits": {
        //         "bestHour": "14:00",
        //         "bestHourMetric": "275K avg views",
        //         "postingSchedule": [],
        //         "heatmap": [
        //             {
        //                 "date": "Oct 24",
        //                 "fullDate": "2025-10-24",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 25",
        //                 "fullDate": "2025-10-25",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 26",
        //                 "fullDate": "2025-10-26",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 27",
        //                 "fullDate": "2025-10-27",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 28",
        //                 "fullDate": "2025-10-28",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 29",
        //                 "fullDate": "2025-10-29",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 30",
        //                 "fullDate": "2025-10-30",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Oct 31",
        //                 "fullDate": "2025-10-31",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 1",
        //                 "fullDate": "2025-11-01",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 2",
        //                 "fullDate": "2025-11-02",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 3",
        //                 "fullDate": "2025-11-03",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 4",
        //                 "fullDate": "2025-11-04",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 5",
        //                 "fullDate": "2025-11-05",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 6",
        //                 "fullDate": "2025-11-06",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 7",
        //                 "fullDate": "2025-11-07",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 8",
        //                 "fullDate": "2025-11-08",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 9",
        //                 "fullDate": "2025-11-09",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 10",
        //                 "fullDate": "2025-11-10",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 11",
        //                 "fullDate": "2025-11-11",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 12",
        //                 "fullDate": "2025-11-12",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 13",
        //                 "fullDate": "2025-11-13",
        //                 "count": 4,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 14",
        //                 "fullDate": "2025-11-14",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 15",
        //                 "fullDate": "2025-11-15",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 16",
        //                 "fullDate": "2025-11-16",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 17",
        //                 "fullDate": "2025-11-17",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 18",
        //                 "fullDate": "2025-11-18",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 19",
        //                 "fullDate": "2025-11-19",
        //                 "count": 0,
        //                 "level": 0
        //             },
        //             {
        //                 "date": "Nov 20",
        //                 "fullDate": "2025-11-20",
        //                 "count": 2,
        //                 "level": 2
        //             },
        //             {
        //                 "date": "Nov 21",
        //                 "fullDate": "2025-11-21",
        //                 "count": 14,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 22",
        //                 "fullDate": "2025-11-22",
        //                 "count": 6,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 23",
        //                 "fullDate": "2025-11-23",
        //                 "count": 4,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 24",
        //                 "fullDate": "2025-11-24",
        //                 "count": 7,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 25",
        //                 "fullDate": "2025-11-25",
        //                 "count": 9,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 26",
        //                 "fullDate": "2025-11-26",
        //                 "count": 6,
        //                 "level": 3
        //             },
        //             {
        //                 "date": "Nov 27",
        //                 "fullDate": "2025-11-27",
        //                 "count": 1,
        //                 "level": 1
        //             }
        //         ],
        //         "hourlyPerf": [
        //             {
        //                 "hour": 0,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 1,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 2,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 3,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 4,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 5,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 6,
        //                 "avgViews": 93324,
        //                 "postCount": 4,
        //                 "score": 34
        //             },
        //             {
        //                 "hour": 7,
        //                 "avgViews": 100369,
        //                 "postCount": 1,
        //                 "score": 36
        //             },
        //             {
        //                 "hour": 8,
        //                 "avgViews": 25305,
        //                 "postCount": 1,
        //                 "score": 9
        //             },
        //             {
        //                 "hour": 9,
        //                 "avgViews": 130953,
        //                 "postCount": 3,
        //                 "score": 48
        //             },
        //             {
        //                 "hour": 10,
        //                 "avgViews": 25463,
        //                 "postCount": 2,
        //                 "score": 9
        //             },
        //             {
        //                 "hour": 11,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 12,
        //                 "avgViews": 109646,
        //                 "postCount": 8,
        //                 "score": 40
        //             },
        //             {
        //                 "hour": 13,
        //                 "avgViews": 93335,
        //                 "postCount": 2,
        //                 "score": 34
        //             },
        //             {
        //                 "hour": 14,
        //                 "avgViews": 275007,
        //                 "postCount": 1,
        //                 "score": 100
        //             },
        //             {
        //                 "hour": 15,
        //                 "avgViews": 58361,
        //                 "postCount": 9,
        //                 "score": 21
        //             },
        //             {
        //                 "hour": 16,
        //                 "avgViews": 68005,
        //                 "postCount": 5,
        //                 "score": 25
        //             },
        //             {
        //                 "hour": 17,
        //                 "avgViews": 83628,
        //                 "postCount": 3,
        //                 "score": 30
        //             },
        //             {
        //                 "hour": 18,
        //                 "avgViews": 0,
        //                 "postCount": 1,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 19,
        //                 "avgViews": 64777,
        //                 "postCount": 4,
        //                 "score": 24
        //             },
        //             {
        //                 "hour": 20,
        //                 "avgViews": 41834,
        //                 "postCount": 1,
        //                 "score": 15
        //             },
        //             {
        //                 "hour": 21,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 22,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             },
        //             {
        //                 "hour": 23,
        //                 "avgViews": 0,
        //                 "postCount": 0,
        //                 "score": 0
        //             }
        //         ]
        //     },
        //     "baseline": {
        //         "views": 46476,
        //         "likes": 228,
        //         "engagement": 0.77,
        //         "viralRate": 15.6,
        //         "viewsScore": 11,
        //         "likesScore": 19,
        //         "engagementScore": 31,
        //         "viralScore": 78
        //     },
        //     "signal": {
        //         "title": "Pin Tweet",
        //         "type": "Breakout Post",
        //         "text": "7 years as an entrepreneur and 1 takeaway:\n\nShip more https://t.co/oNZ7pk3Eqs",
        //         "createdAt": "Jan 7, 2023",
        //         "likes": "10K",
        //         "replies": "448",
        //         "views": "2.5M",
        //         "multiplier": "53.3×",
        //         "url": "https://x.com/marclou/status/1611708982841819137",
        //         "hasMedia": true,
        //         "mediaType": "image"
        //     },
        //     "replyStrategy": {
        //         "replyCount": 14,
        //         "avgLength": 100,
        //         "archetype": "Value Builder",
        //         "metrics": {
        //             "spamScore": 21,
        //             "valueScore": 43,
        //             "neutralScore": 36
        //         },
        //         "topTargets": [
        //             {
        //                 "count": 2,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1986893288528351232/F21QEfrk_normal.jpg",
        //                 "handle": "JeremyLasne"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1442604184725901312/tbbsFD4-_normal.jpg",
        //                 "handle": "thepatwalls"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1829071073121275904/wuJNQJn3_normal.jpg",
        //                 "handle": "ryanseanbadger"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1799375956622094336/tHMqEgSm_normal.jpg",
        //                 "handle": "awpthorp"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1603462822423416832/Rck3-3Ov_normal.png",
        //                 "handle": "martindonadieu"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1824757853728407552/HIJ6pVFY_normal.jpg",
        //                 "handle": "AndriiSolokh"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1975345094581686272/dO46-Jay_normal.jpg",
        //                 "handle": "Sayyidalijufri"
        //             },
        //             {
        //                 "count": 1,
        //                 "avatar": "https://pbs.twimg.com/profile_images/1937129224944402432/iO2eoXM2_normal.jpg",
        //                 "handle": "ClimStefan"
        //             }
        //         ]
        //     }
        // };

        return json({
            success: true,
            analyticsData: analyticsData
        });

    } catch (e: any) {
        console.error("Analyze Error:", e);
        return json({
            success: false,
            message: e.message || 'Profile not found or Account is private'
        }, { status: 404 });
    }
};
