"use client";

import * as z from "zod";

const createEnv = () => {
  const EnvSchema = z.object({
    APP_NAME: z.string(),
    API_URL: z.string(),
    SERVICE_NAME: z.string(),
    APP_URL: z.string().optional().default("http://localhost:3000"),
    SECRET_KEY: z.string(),
    PASSPHRASE: z.string(),
    SIDEBAR: z.string(),
    // Firebase Configuration
    FIREBASE_API_KEY: z.string(),
    FIREBASE_AUTH_DOMAIN: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_STORAGE_BUCKET: z.string(),
    FIREBASE_MESSAGING_SENDER_ID: z.string(),
    FIREBASE_APP_ID: z.string(),
    FIREBASE_MEASUREMENT_ID: z.string(),
    FIREBASE_VAPID_KEY: z.string(),
  });

  const envVars = {
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    SERVICE_NAME: process.env.NEXT_PUBLIC_SERVICE_NAME,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
    PASSPHRASE: process.env.NEXT_PUBLIC_PASSPHRASE,
    SIDEBAR: process.env.NEXT_PUBLIC_SIDEBAR,
    // Firebase Configuration
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}
`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
