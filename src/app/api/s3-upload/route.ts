import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

    const key = `uploads/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await getClient().send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const url = `${ENDPOINT}/${BUCKET}/${key}`;
    return NextResponse.json({ url, key });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[s3-upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
