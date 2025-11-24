// src/lib/server/firebase.ts
import admin from 'firebase-admin';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { 
    FIREBASE_PROJECT_ID, 
    FIREBASE_CLIENT_EMAIL, 
    FIREBASE_PRIVATE_KEY 
} from '$env/static/private';

let app;

if (!getApps().length) {
    app = initializeApp({
        credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            // REPLACE QUAN TRỌNG: Fix lỗi xuống dòng của private key
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
    });
} else {
    app = getApp();
}

export const adminAuth = getAuth(app);
export const db = getFirestore(app);
