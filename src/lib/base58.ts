import baseX from "base-x";

export const ID_LENGTH = 16;
export const ENCRYPTION_KEY_LENGTH = 128;
export const LATEST_KEY_VERSION = 2;

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const toBase58 = (b: Uint8Array) => baseX(alphabet).encode(b);

export const fromBase58 = (s: string) => baseX(alphabet).decode(s);


export function generateId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  return toBase58(bytes);
}


export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128,
    },
    true,
    ["encrypt", "decrypt"],
  );
}


////// ENCRYPTION

export async function encrypt(text: string): Promise<{ encrypted: Uint8Array; iv: Uint8Array; key: Uint8Array }> {
  const key = await generateKey();

  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(text),
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return {
    encrypted: new Uint8Array(encryptedBuffer),
    key: new Uint8Array(exportedKey),
    iv,
  };
}

export async function decrypt(encrypted: string, keyData: Uint8Array, iv: string, keyVersion: number): Promise<string> {
  const algorithm = keyVersion === 1 ? "AES-CBC" : "AES-GCM";

  const key = await crypto.subtle.importKey("raw", keyData, { name: algorithm, length: 128 }, false, ["decrypt"]);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: algorithm,
      iv: fromBase58(iv),
    },
    key,
    fromBase58(encrypted),
  );

  return new TextDecoder().decode(decrypted);
}



//// DECODING

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function encodeCompositeKey(version: number, id: string, encryptionKey: Uint8Array): string {
  if (version < 0 || version > 255) {
    throw new Error("Version must fit in a byte");
  }
  const compositeKey = new Uint8Array([version, ...fromBase58(id), ...encryptionKey]);

  return toBase58(compositeKey);
}

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function decodeCompositeKey(compositeKey: string): { id: string; encryptionKey: Uint8Array; version: number } {
  const decoded = fromBase58(compositeKey);
  const version = decoded.at(0);

  if (version === 1 || version === 2) {
    return {
      id: toBase58(decoded.slice(1, 1 + ID_LENGTH)),
      encryptionKey: decoded.slice(1 + ID_LENGTH, 1 + ID_LENGTH + ENCRYPTION_KEY_LENGTH),
      version,
    };
  }

  throw new Error(`Unsupported composite key version: ${version}`);
}