import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "node:crypto";
import type {
  CipherCCMTypes,
  CipherOCBTypes,
  CipherGCMTypes,
} from "node:crypto";

export type EncryptAlgorithm =
  | CipherCCMTypes
  | CipherOCBTypes
  | CipherGCMTypes
  | string;
export type EncryptSecret = Buffer;

export const defaultEncryptAlgorithm: EncryptAlgorithm = "aes-256-cbc";

export const importEncryptSecret = (
  secret?: string,
  _encryptAlgorithm?: EncryptAlgorithm | "" // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<EncryptSecret> => {
  return Promise.resolve(Buffer.from(secret ?? randomEncryptSecret()));
};

/**
 * Create a new CSRF token
 */
export const create = (
  secret: string,
  encryptSecret: EncryptSecret,
  encryptAlgorithm?: EncryptAlgorithm | ""
): Promise<string> => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(
    encryptAlgorithm || defaultEncryptAlgorithm,
    Buffer.from(encryptSecret),
    iv
  );
  const encrypted =
    cipher.update(secret, "utf8", "base64") + cipher.final("base64");
  return Promise.resolve(`${iv.toString("base64")}:${encrypted}`);
};

/**
 * Check csrf token
 */
export const verify = (
  secret: string,
  token: string,
  encryptSecret: EncryptSecret,
  encryptAlgorithm?: EncryptAlgorithm | ""
): Promise<boolean> => {
  const [iv, encrypted] = token.split(":");
  if (!iv || !encrypted) {
    return Promise.resolve(false);
  }
  let decrypted;
  try {
    const decipher = createDecipheriv(
      encryptAlgorithm || defaultEncryptAlgorithm,
      Buffer.from(encryptSecret),
      Buffer.from(iv, "base64")
    );
    decrypted =
      decipher.update(encrypted, "base64", "utf8") + decipher.final("utf8");
  } catch {
    return Promise.resolve(false);
  }
  return Promise.resolve(decrypted === secret);
};

/**
 * Create cryptographic random value
 */
export const randomSecret = () => randomUUID();

/**
 * Create a random encrypt secret
 */
export const randomEncryptSecret = () => randomBytes(22).toString("base64");
