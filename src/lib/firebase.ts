import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
import { env } from "@/config/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app, messaging };
