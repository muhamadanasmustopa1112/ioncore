export interface S3UploadResult {
  key: string;
  url: string;
}

export async function uploadImageToS3(file: File): Promise<S3UploadResult> {
  const res = await fetch("/api/s3-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to get upload URL (${res.status})`);
  }

  const { putUrl, url, key } = await res.json();

  const put = await fetch(putUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!put.ok) {
    const text = await put.text();
    throw new Error(`S3 upload failed: ${text}`);
  }

  return { key, url };
}

export async function uploadImagesToS3(files: File[]): Promise<S3UploadResult[]> {
  return Promise.all(files.map(uploadImageToS3));
}
