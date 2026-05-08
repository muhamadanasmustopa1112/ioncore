export interface S3UploadResult {
  key: string;
  url: string;
}

export async function uploadImageToS3(file: File): Promise<S3UploadResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/s3-upload", { method: "POST", body: form });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Upload failed (${res.status})`);
  }

  return res.json();
}

export async function uploadImagesToS3(files: File[]): Promise<S3UploadResult[]> {
  return Promise.all(files.map(uploadImageToS3));
}
