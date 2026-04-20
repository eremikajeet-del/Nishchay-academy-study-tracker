import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { getLevelFromXP, getXPForNextLevel } from '@/lib/permissions';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const levelInfo = getLevelFromXP(user!.xp);
    const xpInfo = getXPForNextLevel(user!.xp);

    return NextResponse.json({
      xp: user!.xp,
      level: levelInfo,
      streak: user!.streak,
      longestStreak: user!.longestStreak,
      xpProgress: xpInfo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
