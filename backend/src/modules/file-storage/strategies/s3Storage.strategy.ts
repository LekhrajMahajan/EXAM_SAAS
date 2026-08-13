import stream from "stream";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { IStorageStrategy } from "./storageStrategy.interface";

export class S3StorageStrategy implements IStorageStrategy {
  private client: any;
  private bucket: string = "";
  private region: string = "";

  public async initialize(settings: Record<string, any>): Promise<void> {
    try {
      // Dynamic import to prevent build errors if the SDK is not installed
      const { S3Client } = require("@aws-sdk/client-s3");
      this.region = settings.AWS_S3_REGION || "us-east-1";
      this.bucket = settings.AWS_S3_BUCKET_NAME || "";

      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: settings.AWS_S3_ACCESS_KEY,
          secretAccessKey: settings.AWS_S3_SECRET_KEY,
        },
      });
    } catch (error) {
      console.warn("AWS SDK not found. S3 Storage Provider will not work unless @aws-sdk/client-s3 is installed.");
    }
  }

  public async upload(file: Express.Multer.File | Buffer, filename: string, mimeType: string, options?: any): Promise<{ url: string; path: string; size: number; key: string }> {
    if (!this.client) {
      throw new Error("S3 Client not initialized. Please ensure @aws-sdk/client-s3 is installed.");
    }

    const { PutObjectCommand } = require("@aws-sdk/client-s3");

    const ext = path.extname(filename);
    const key = `uploads/${uuidv4()}${ext}`;

    let body: Buffer;
    let size = 0;

    if (Buffer.isBuffer(file)) {
      body = file;
      size = file.length;
    } else if (file.buffer) {
      body = file.buffer;
      size = file.buffer.length;
    } else {
      const fs = require("fs");
      body = fs.readFileSync(file.path);
      size = body.length;
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
      ACL: options?.isPublic ? "public-read" : "private"
    });

    await this.client.send(command);

    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    return {
      url,
      path: url,
      size,
      key
    };
  }

  public async download(key: string): Promise<Buffer> {
    if (!this.client) throw new Error("S3 Client not initialized.");
    
    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);
    
    // Convert ReadableStream to Buffer
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      response.Body.on("data", (chunk: any) => chunks.push(chunk));
      response.Body.on("error", reject);
      response.Body.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  public async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.client) throw new Error("S3 Client not initialized.");
    
    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    const { getSignedUrl: awsGetSignedUrl } = require("@aws-sdk/s3-request-presigner");

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await awsGetSignedUrl(this.client, command, { expiresIn });
  }

  public async delete(key: string): Promise<boolean> {
    if (!this.client) throw new Error("S3 Client not initialized.");
    
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
    return true;
  }
}
