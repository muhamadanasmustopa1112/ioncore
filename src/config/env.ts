"use client";

import * as z from "zod";

const createEnv = () => {
  const EnvSchema = z.object({
    APP_NAME: z.string(),
    API_URL: z.string(),
    SERVICE_NAME: z.string(),
    APP_URL: z.string().optional().default("http://localhost:3000"),
    // commenting due security reason
    SECRET_KEY: z.string(),
    PASSPHRASE: z.string(),
  });

  const envVars = {
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    SERVICE_NAME: process.env.NEXT_PUBLIC_SERVICE_NAME,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // commenting due security reason
    SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
    PASSPHRASE: process.env.NEXT_PUBLIC_PASSPHRASE,
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
