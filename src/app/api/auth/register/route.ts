import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Username must be at least 2 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { email, username, password } = result.data;

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const autoApproveSetting = await db.appSetting.findUnique({ where: { key: 'auto_approve' } });
    const autoApprove = autoApproveSetting?.value === 'true';
    const status = autoApprove ? 'approved' : 'pending';

    const user = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'student',
        status,
      },
    });

    return NextResponse.json({
      message: autoApprove ? 'Registration successful! You can now log in.' : 'Registration successful! Please wait for admin approval.',
      status,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
