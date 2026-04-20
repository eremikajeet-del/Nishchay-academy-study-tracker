import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'pending') {
      return NextResponse.json({ error: 'Your account is under review. Please wait for admin approval.', status: 'pending' }, { status: 403 });
    }

    if (user.status === 'rejected') {
      return NextResponse.json({ error: 'Your request was rejected. Contact admin.', status: 'rejected' }, { status: 403 });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
