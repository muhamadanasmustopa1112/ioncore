import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function GET() {
  const swCode = `
    importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
    importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

    firebase.initializeApp({
      apiKey: "${env.FIREBASE_API_KEY}",
      authDomain: "${env.FIREBASE_AUTH_DOMAIN}",
      projectId: "${env.FIREBASE_PROJECT_ID}",
      storageBucket: "${env.FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${env.FIREBASE_APP_ID}",
      measurementId: "${env.FIREBASE_MEASUREMENT_ID}",
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      // Background message handler
    });
  `;

  return new NextResponse(swCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
