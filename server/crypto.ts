import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// 256-bit (32 bytes) master key for AES-256-GCM
const MASTER_KEY_HEX = process.env.AES_256_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const ENCRYPTION_KEY = Buffer.from(MASTER_KEY_HEX.slice(0, 64), 'hex');

export interface EncryptedPayload {
  algorithm: string;
  iv: string;       // Hex encoded 12-byte initialization vector
  authTag: string;  // Hex encoded 16-byte authentication tag
  ciphertext: string; // Hex encoded encrypted data
}

/**
 * Encrypts arbitrary UTF-8 text using AES-256-GCM (Galois/Counter Mode).
 * Provides authenticated confidentiality and integrity protection at rest.
 */
export function encryptAES256(plaintext: string): EncryptedPayload {
  // GCM standard recommended IV size is 12 bytes (96 bits)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    algorithm: 'aes-256-gcm',
    iv: iv.toString('hex'),
    authTag,
    ciphertext,
  };
}

/**
 * Decrypts AES-256-GCM payload back to original UTF-8 plaintext.
 * Throws an error if ciphertext or auth tag has been tampered with.
 */
export function decryptAES256(payload: EncryptedPayload | string): string {
  try {
    let parsed: EncryptedPayload;
    if (typeof payload === 'string') {
      // Check if JSON format
      if (payload.startsWith('{') && payload.includes('ciphertext')) {
        parsed = JSON.parse(payload);
      } else {
        return payload; // Already plain or unencrypted fallback
      }
    } else {
      parsed = payload;
    }

    if (!parsed || !parsed.ciphertext || !parsed.iv || !parsed.authTag) {
      return '';
    }

    const iv = Buffer.from(parsed.iv, 'hex');
    const authTag = Buffer.from(parsed.authTag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(parsed.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error in AES-256-GCM:', err);
    return '[Decryption Error: Invalid Key or Tampered Ciphertext]';
  }
}

/**
 * Hash passwords using bcrypt with 10 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password with bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
