import fs from "fs";
import path from "path";
import stream from "stream";
import { v4 as uuidv4 } from "uuid";
import { IStorageStrategy } from "./storageStrategy.interface";

export class LocalStorageStrategy implements IStorageStrategy {
  private uploadDir: string = path.join(process.cwd(), "uploads");

  public initialize(settings: Record<string, any>): void {
    if (settings.DEFAULT_STORAGE_PATH && typeof settings.DEFAULT_STORAGE_PATH === 'string') {
      const storagePath = settings.DEFAULT_STORAGE_PATH.trim();
      // Sanity check: If someone accidentally entered a URL as the local storage path, ignore it
      if (!storagePath.startsWith('http://') && !storagePath.startsWith('https://')) {
        this.uploadDir = path.isAbsolute(storagePath) 
          ? storagePath 
          : path.join(process.cwd(), storagePath);
      }
    }

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async upload(file: Express.Multer.File | Buffer, filename: string, mimeType: string, options?: any): Promise<{ url: string; path: string; size: number; key: string }> {
    const ext = path.extname(filename);
    const key = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, key);

    let size = 0;

    if (Buffer.isBuffer(file)) {
      await fs.promises.writeFile(filePath, file);
      size = file.length;
    } else {
      if (file.buffer) {
        await fs.promises.writeFile(filePath, file.buffer);
        size = file.buffer.length;
      } else if (file.path) {
        await fs.promises.copyFile(file.path, filePath);
        const stat = await fs.promises.stat(filePath);
        size = stat.size;
      } else {
        throw new Error("Invalid file object provided for local upload");
      }
    }

    const url = `/uploads/${key}`; // Default local route serving

    return {
      url,
      path: filePath,
      size,
      key,
    };
  }

  public async download(key: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${key}`);
    }
    return fs.promises.readFile(filePath);
  }

  public async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    // Local storage doesn't usually use signed URLs in the same way as S3, 
    // but we can generate a temporary access token pattern if needed.
    // For now, returning the direct URL.
    return `/uploads/${key}`;
  }

  public async delete(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
