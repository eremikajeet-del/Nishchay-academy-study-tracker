import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'study-tracker-secret-key-2024';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: { userId: string; email: string; role: string; status: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string; role: string; status: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string; status: string };
  } catch {
    return null;
  }
}

export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return null;
    const user = await db.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch {
    return null;
  }
}

export function requireAuth(user: any) {
  if (!user) {
    return { error: 'Authentication required', status: 401 };
  }
  if (user.status !== 'approved') {
    return { error: 'Account not approved', status: 403 };
  }
  return null;
}

export function requireAdmin(user: any) {
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  return null;
}
