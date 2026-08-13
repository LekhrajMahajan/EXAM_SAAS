import stream from "stream";

export interface IStorageStrategy {
  /**
   * Initialize the strategy with settings dynamically fetched from DB.
   */
  initialize(settings: Record<string, any>): void;

  /**
   * Upload a file and return the access URL or key.
   */
  upload(file: Express.Multer.File | Buffer, filename: string, mimeType: string, options?: any): Promise<{ url: string; path: string; size: number; key: string }>;

  /**
   * Download a file by key/path.
   */
  download(key: string): Promise<Buffer | stream.Readable>;

  /**
   * Generate a signed URL for secure, temporary access.
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  /**
   * Delete a file from storage.
   */
  delete(key: string): Promise<boolean>;
}
