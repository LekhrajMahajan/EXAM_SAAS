import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { IStorageStrategy } from "./storageStrategy.interface";

export class CloudinaryStorageStrategy implements IStorageStrategy {
  public initialize(settings: Record<string, any>): void {
    cloudinary.config({
      cloud_name: settings.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: settings.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
      api_secret: settings.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async upload(file: Express.Multer.File | Buffer, filename: string, mimeType: string, options?: any): Promise<{ url: string; path: string; size: number; key: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || "uploads",
          public_id: filename.split('.')[0] + "_" + Date.now(),
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary upload failed: No result returned"));
          }
          
          resolve({
            url: result.secure_url,
            path: result.secure_url,
            size: result.bytes,
            key: result.public_id,
          });
        }
      );

      if (Buffer.isBuffer(file)) {
        streamifier.createReadStream(file).pipe(uploadStream);
      } else if (file.buffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else {
        if (file.path) {
          cloudinary.uploader.upload(file.path, {
            folder: options?.folder || "uploads",
            public_id: filename.split('.')[0] + "_" + Date.now(),
            resource_type: "auto",
          }).then(result => {
             resolve({
                url: result.secure_url,
                path: result.secure_url,
                size: result.bytes,
                key: result.public_id,
             });
          }).catch(reject);
        } else {
          reject(new Error("Invalid file object provided for cloudinary upload"));
        }
      }
    });
  }

  public async download(key: string): Promise<Buffer> {
     throw new Error("Download not implemented for Cloudinary (use direct URL)");
  }

  public async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    return cloudinary.url(key);
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(key);
      return result.result === 'ok';
    } catch (e) {
      return false;
    }
  }
}
