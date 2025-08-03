// lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // ou '2h', '30m' etc.
    algorithm: 'HS256',
  });
}