import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.S3_UPLOAD_ENDPOINT!;
const BUCKET = process.env.S3_UPLOAD_BUCKET!;
const REGION = process.env.S3_UPLOAD_REGION ?? "ap-southeast-3";

function getClient() {
  return new S3Client({
    endpoint: ENDPOINT,
    region: REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY!,
      secretAccessKey: process.env.S3_UPLOAD_SECRET!,
    },
    forcePathStyle: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();
    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

    const key = `uploads/${Date.now()}-${filename}`;

    const putUrl = await getSignedUrl(
      getClient(),
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 3600 },
    );

    const publicUrl = `${ENDPOINT}/${BUCKET}/${key}`;

    return NextResponse.json({ putUrl, url: publicUrl, key });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[s3-upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
