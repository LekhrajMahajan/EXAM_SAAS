import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_secret_key_32_bytes_long!!";

export const decrypt = (text: string): string => {
    try {
        const parts = text.split(":");
        if (parts.length !== 3) return text;
        const [ivHex, authTagHex, encryptedHex] = parts;
        const decipher = crypto.createDecipheriv(
            ALGORITHM, 
            Buffer.from(ENCRYPTION_KEY), 
            Buffer.from(ivHex, "hex")
        );
        decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
        let decrypted = decipher.update(encryptedHex, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("Decryption failed", error);
        return text;
    }
};