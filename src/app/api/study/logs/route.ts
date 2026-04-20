import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');

    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await db.studyLog.findMany({
      where: { userId: user!.id, date: { gte: since } },
      include: { topic: { select: { name: true, color: true } } },
      orderBy: { date: 'desc' },
    });

    const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);

    return NextResponse.json({ logs, totalMinutes, count: logs.length });
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
    const { topicId, duration, notes, type } = body;

    if (!topicId || !duration) {
      return NextResponse.json({ error: 'topicId and duration required' }, { status: 400 });
    }

    const log = await db.studyLog.create({
      data: {
        topicId,
        userId: user!.id,
        duration,
        notes: notes?.trim() || null,
        type: type || 'study',
      },
    });

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = 1;
    if (user!.lastStudyDate === yesterday) {
      newStreak = user!.streak + 1;
    } else if (user!.lastStudyDate === today) {
      newStreak = user!.streak;
    }

    const longestStreak = Math.max(newStreak, user!.longestStreak);

    await db.user.update({
      where: { id: user!.id },
      data: {
        lastStudyDate: today,
        streak: newStreak,
        longestStreak,
        xp: { increment: Math.floor(duration / 5) },
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
