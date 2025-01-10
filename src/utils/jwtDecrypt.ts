import { compactDecrypt } from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export const jwtDecrypt = async (encryptedJwt: string) => {
  try {
    const decrypted = await compactDecrypt(encryptedJwt, new TextEncoder().encode(JWT_SECRET));
    const userData = JSON.parse(new TextDecoder().decode(decrypted.plaintext));
    return userData as { email: string; username: string; phone_number?: string; };
  } catch (error) {
    console.error('JWT 복호화 오류:', error);
    return null;
  }
};
