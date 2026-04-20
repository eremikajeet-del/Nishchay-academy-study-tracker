import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lastStudyDate: user.lastStudyDate,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get user' }, { status: 500 });
  }
}
