import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const revisions = await db.revision.findMany({
      where: { userId: user!.id },
      include: { topic: { select: { name: true, color: true } } },
      orderBy: { scheduledAt: 'asc' },
    });

    return NextResponse.json(revisions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const body = await request.json();
    const { topicId, scheduledAt } = body;

    if (!topicId || !scheduledAt) {
      return NextResponse.json({ error: 'topicId and scheduledAt required' }, { status: 400 });
    }

    const revision = await db.revision.create({
      data: {
        topicId,
        userId: user!.id,
        scheduledAt: new Date(scheduledAt),
      },
    });

    return NextResponse.json(revision, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id, status } = await request.json();

    const revision = await db.revision.update({
      where: { id, userId: user!.id },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });

    if (status === 'completed') {
      await db.user.update({
        where: { id: user!.id },
        data: { xp: { increment: 15 } },
      });
    }

    return NextResponse.json(revision);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
