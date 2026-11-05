import fs from "fs";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "@/lib/observability/logger";

export interface MediaUploadOptions {
  filename?: string;
  contentType: string;
  folder?: "screenshots" | "renders" | "audio" | "avatars" | "videos";
}

export interface MediaUploadResult {
  url: string;
  storageProvider: "s3_r2" | "local_cdn";
  sizeBytes: number;
}

/**
 * Enterprise Media Storage Service.
 * Directs uploads to Cloudflare R2 / AWS S3 when configured,
 * or serves via local ephemeral cache with automatic TTL garbage collection
 * so customer media never bloats the Git repository or deployment artifacts.
 */
export async function uploadMediaBuffer(
  buffer: Buffer,
  options: MediaUploadOptions
): Promise<MediaUploadResult> {
  const folder = options.folder || "screenshots";
  const hash = crypto.randomBytes(8).toString("hex");
  const ext = options.filename
    ? path.extname(options.filename)
    : options.contentType.includes("png")
    ? ".png"
    : options.contentType.includes("mp4")
    ? ".mp4"
    : ".bin";
  const finalFilename = options.filename
    ? `${path.basename(options.filename, ext)}_${hash}${ext}`
    : `${folder}_${hash}${ext}`;

  // 1. Cloudflare R2 / AWS S3 Object Storage (Zero-Disk Footprint)
  const r2Bucket = process.env.R2_BUCKET || process.env.AWS_S3_BUCKET;
  const r2AccountId = process.env.R2_ACCOUNT_ID;
  const r2Endpoint =
    process.env.R2_ENDPOINT ||
    (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : undefined);
  const r2AccessKey = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const publicCdnUrl = process.env.NEXT_PUBLIC_CDN_URL || process.env.R2_PUBLIC_URL;

  if (r2Bucket && r2AccessKey && r2SecretKey) {
    try {
      const key = `${folder}/${finalFilename}`;
      logger.info(`Uploading media to Cloudflare R2 / S3: ${key} (${buffer.length} bytes)`);

      const s3Client = new S3Client({
        region: "auto",
        endpoint: r2Endpoint,
        credentials: {
          accessKeyId: r2AccessKey,
          secretAccessKey: r2SecretKey,
        },
      });

      await s3Client.send(
        new PutObjectCommand({
          Bucket: r2Bucket,
          Key: key,
          Body: buffer,
          ContentType: options.contentType,
        })
      );

      // Return public CDN URL or direct endpoint
      const cdnBase = publicCdnUrl || (r2Endpoint ? `${r2Endpoint}/${r2Bucket}` : `https://${r2Bucket}.s3.amazonaws.com`);
      return {
        url: `${cdnBase.replace(/\/$/, "")}/${key}`,
        storageProvider: "s3_r2",
        sizeBytes: buffer.length,
      };
    } catch (err) {
      logger.warn("Cloudflare R2 storage upload encountered error, falling back to local storage:", {
        error: String(err),
      });
    }
  }

  // 2. Ephemeral Local Fallback with Automatic TTL Garbage Collection
  const baseUploadDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  const localFilePath = path.join(baseUploadDir, finalFilename);
  fs.writeFileSync(localFilePath, buffer);

  // Trigger non-blocking asynchronous cleanup of files older than 48 hours to prevent disk bloat
  scheduleStorageGarbageCollection(baseUploadDir, 48 * 60 * 60 * 1000).catch(() => {});

  const webUrl = `/uploads/${folder}/${finalFilename}`;
  return {
    url: webUrl,
    storageProvider: "local_cdn",
    sizeBytes: buffer.length,
  };
}

/**
 * Removes local media files older than maxAgeMs to keep local storage lean.
 */
async function scheduleStorageGarbageCollection(directory: string, maxAgeMs: number) {
  try {
    const files = await fs.promises.readdir(directory);
    const now = Date.now();
    for (const file of files) {
      if (file.startsWith(".gitkeep")) continue;
      const filePath = path.join(directory, file);
      const stat = await fs.promises.stat(filePath).catch(() => null);
      if (stat && now - stat.mtimeMs > maxAgeMs) {
        await fs.promises.unlink(filePath).catch(() => {});
      }
    }
  } catch {
    // Non-fatal background maintenance
  }
}

