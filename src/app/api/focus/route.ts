import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const sessions = await db.focusSession.findMany({
      where: { userId: user!.id },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { duration } = await request.json();

    const session = await db.focusSession.create({
      data: {
        userId: user!.id,
        duration: duration || 25,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id, completed } = await request.json();

    const session = await db.focusSession.update({
      where: { id, userId: user!.id },
      data: {
        completed: completed !== undefined ? completed : true,
        completedAt: new Date(),
        xpEarned: 30,
      },
    });

    if (completed) {
      await db.user.update({
        where: { id: user!.id },
        data: { xp: { increment: 30 } },
      });
    }

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
