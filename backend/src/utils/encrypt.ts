import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_secret_key_32_bytes_long!!";

export const encrypt = (text: string): string => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        const authTag = cipher.getAuthTag().toString("hex");
        return `${iv.toString("hex")}:${authTag}:${encrypted}`;
    } catch (error) {
        console.error("Encryption failed", error);
        return text;
    }
};