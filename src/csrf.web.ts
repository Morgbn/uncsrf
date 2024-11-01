const webCrypto = globalThis.crypto;
const subtle: Crypto["subtle"] = webCrypto.subtle;
const getRandomValues: Crypto["getRandomValues"] = (array: any) =>
  webCrypto.getRandomValues(array);

export type EncryptAlgorithm = "AES-CBC";
export type EncryptSecret = CryptoKey;

export const defaultEncryptAlgorithm: EncryptAlgorithm = "AES-CBC";

export const importEncryptSecret = async (
  secret?: string,
  encryptAlgorithm?: EncryptAlgorithm | "",
): Promise<EncryptSecret> => {
  const keyData = new TextEncoder().encode(secret ?? randomEncryptSecret());
  return await subtle.importKey(
    "raw",
    keyData,
    { name: encryptAlgorithm || defaultEncryptAlgorithm },
    false,
    ["encrypt", "decrypt"],
  );
};

/**
 * Create a new CSRF token
 */
export const create = async (
  secret: string,
  encryptSecret: EncryptSecret,
  encryptAlgorithm?: EncryptAlgorithm | "",
): Promise<string> => {
  const iv = getRandomValues(new Uint8Array(16));
  const encrypted = await subtle.encrypt(
    { name: encryptAlgorithm || defaultEncryptAlgorithm, iv },
    encryptSecret,
    new TextEncoder().encode(secret),
  );
  const encryptedBuffer = Buffer.from(new Uint8Array(encrypted));
  return `${Buffer.from(iv).toString("base64")}:${encryptedBuffer.toString(
    "base64",
  )}`;
};

/**
 * Check csrf token
 */
export const verify = async (
  secret: string,
  token: string,
  encryptSecret: EncryptSecret,
  encryptAlgorithm?: EncryptAlgorithm | "",
): Promise<boolean> => {
  const [iv, encrypted] = token.split(":");
  if (!iv || !encrypted) {
    return false;
  }
  let decrypted;
  try {
    const encodedDecrypted = await subtle.decrypt(
      {
        name: encryptAlgorithm || defaultEncryptAlgorithm,
        iv: Buffer.from(iv, "base64"),
      },
      encryptSecret,
      Buffer.from(encrypted, "base64"),
    );
    decrypted = new TextDecoder().decode(encodedDecrypted);
  } catch {
    return false;
  }
  return decrypted === secret;
};

/**
 * Create cryptographic random value
 */
export const randomSecret = () => webCrypto.randomUUID();

/**
 * Create a random encrypt secret
 */
export const randomEncryptSecret = () =>
  [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
