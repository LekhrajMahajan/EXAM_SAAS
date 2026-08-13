import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const validatePasswordPolicy = (password: string): void => {
  const settingsCache = require("../modules/system-settings/settingsCache.service").default;
  
  const minLength = Number(settingsCache.get("MIN_PASSWORD_LENGTH", 8));
  const maxLength = Number(settingsCache.get("MAX_PASSWORD_LENGTH", 128));
  const requireUppercase = settingsCache.get("REQUIRE_UPPERCASE", "true") === "true";
  const requireLowercase = settingsCache.get("REQUIRE_LOWERCASE", "true") === "true";
  const requireNumbers = settingsCache.get("REQUIRE_NUMBERS", "true") === "true";
  const requireSpecial = settingsCache.get("REQUIRE_SPECIAL_CHARACTERS", "false") === "true";

  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters long`);
  }
  if (password.length > maxLength) {
    throw new Error(`Password cannot exceed ${maxLength} characters`);
  }
  if (requireUppercase && !/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (requireNumbers && !/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
};
