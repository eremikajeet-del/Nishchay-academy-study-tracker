import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const updated = await db.user.update({
      where: { id: userId },
      data: { status: 'rejected' },
    });

    return NextResponse.json({ message: 'User rejected', user: { id: updated.id, email: updated.email, status: updated.status } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
