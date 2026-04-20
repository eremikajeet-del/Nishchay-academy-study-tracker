import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');

    const where = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const counts = await db.user.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const stats = {
      total: users.length,
      pending: counts.find(c => c.status === 'pending')?._count.status || 0,
      approved: counts.find(c => c.status === 'approved')?._count.status || 0,
      rejected: counts.find(c => c.status === 'rejected')?._count.status || 0,
    };

    return NextResponse.json({ users, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
