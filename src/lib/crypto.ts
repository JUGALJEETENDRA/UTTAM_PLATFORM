import CryptoJS from 'crypto-js';

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function decryptObject(encryptedObj: any, keyHex: string): any {
  if (!encryptedObj || !encryptedObj.encrypted) {
    return encryptedObj;
  }
  
  try {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Base64.parse(encryptedObj.iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedObj.data, key, { iv: iv });
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}
