// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIrp4rQ1aIulQ207o79IffjBdC_IqjBTI",
  authDomain: "xanalytics-36761.firebaseapp.com",
  projectId: "xanalytics-36761",
  storageBucket: "xanalytics-36761.firebasestorage.app",
  messagingSenderId: "741683612458",
  appId: "1:741683612458:web:b5a2ed06e14bed440c2c53",
  measurementId: "G-JVWXG165WD"
};

// Khởi tạo Firebase (tránh khởi tạo lại nếu đã có)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
