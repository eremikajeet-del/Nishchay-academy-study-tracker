import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const { userId, role } = await request.json();
    if (!userId || !role) return NextResponse.json({ error: 'userId and role required' }, { status: 400 });

    const validRoles = ['student', 'admin', 'teacher', 'premium'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ message: 'Role updated', user: { id: updated.id, role: updated.role } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
