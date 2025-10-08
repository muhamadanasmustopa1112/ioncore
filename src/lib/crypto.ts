import { createCipheriv, createDecipheriv } from "crypto";

const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE || ""; // Gunakan key yang lebih kompleks di production

const key = Buffer.from(passphrase.substring(0, 32));
const iv = Buffer.from(passphrase.substring(0, 16));

const algorithm = "aes-256-cbc";

/**
 * Mengenkripsi data menggunakan AES-256-CBC.
 * Modul crypto Node.js sudah menangani PKCS#7 padding secara default.
 * @param data - String teks biasa yang akan dienkripsi.
 * @returns String Base64 dari data terenkripsi.
 */
function encrypt(data: string): string {
  if (!data) {
    return "";
  }

  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");

  encrypted += cipher.final("hex");

  return Buffer.from(encrypted, "hex").toString("base64");
}

/**
 * Mendekripsi data menggunakan AES-256-CBC.
 * @param data - String Base64 dari data terenkripsi.
 * @returns String teks biasa yang telah terdekripsi.
 */
function decrypt(data: string): string {
  if (!data) {
    return "";
  }

  const encryptedHex = Buffer.from(data, "base64").toString("hex");

  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}

export { encrypt, decrypt };
