import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await db.mood.findMany({
      where: { userId: user!.id, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(moods);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { mood, note } = await request.json();

    if (!mood) {
      return NextResponse.json({ error: 'Mood required' }, { status: 400 });
    }

    const moodEntry = await db.mood.create({
      data: {
        userId: user!.id,
        mood,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json(moodEntry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
