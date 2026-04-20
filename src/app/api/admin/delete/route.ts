import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    if (userId === user!.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
