import * as Crypto from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

export type PasswordRecord = { salt: string; hash: string };
export interface PasswordHasher {
  create(password: string): Promise<PasswordRecord>;
  verify(password: string, record: PasswordRecord): Promise<boolean>;
}
async function derive(password: string, salt: string): Promise<string> {
  return bytesToHex(await pbkdf2Async(sha256, password, hexToBytes(salt), { c: 120000, dkLen: 32 }));
}
export const passwordHasher: PasswordHasher = {
  async create(password) {
    const salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
    return { salt, hash: await derive(password, salt) };
  },
  async verify(password, record) {
    const actual = await derive(password, record.salt);
    if (actual.length !== record.hash.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index++) difference |= actual.charCodeAt(index) ^ record.hash.charCodeAt(index);
    return difference === 0;
  },
};
