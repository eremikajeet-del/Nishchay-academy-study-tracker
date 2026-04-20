import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { getLevelFromXP } from '@/lib/permissions';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalStudyLogs, weeklyLogs, monthlyLogs, topics, flashcards, goals, revisions, moods, focusSessions] = await Promise.all([
      db.studyLog.count({ where: { userId: user!.id } }),
      db.studyLog.findMany({ where: { userId: user!.id, date: { gte: sevenDaysAgo } } }),
      db.studyLog.findMany({ where: { userId: user!.id, date: { gte: thirtyDaysAgo } } }),
      db.topic.count({ where: { userId: user!.id } }),
      db.flashcard.count({ where: { userId: user!.id } }),
      db.goal.count({ where: { userId: user!.id } }),
      db.revision.count({ where: { userId: user!.id, status: 'pending' } }),
      db.mood.findMany({ where: { userId: user!.id, date: { gte: thirtyDaysAgo } } }),
      db.focusSession.findMany({ where: { userId: user!.id, completed: true } }),
    ]);

    const totalMinutes = monthlyLogs.reduce((sum, log) => sum + log.duration, 0);
    const weeklyMinutes = weeklyLogs.reduce((sum, log) => sum + log.duration, 0);

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayLogs = weeklyLogs.filter(l => new Date(l.date).toISOString().split('T')[0] === dateStr);
      return {
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        minutes: dayLogs.reduce((sum, l) => sum + l.duration, 0),
        sessions: dayLogs.length,
      };
    });

    const moodData = moods.map(m => ({
      mood: m.mood,
      date: m.date,
      note: m.note,
    }));

    const level = getLevelFromXP(user!.xp);
    const currentLevelXP = (level - 1) * 100;
    const xpProgress = ((user!.xp - currentLevelXP) / 100) * 100;

    const completedGoals = await db.goal.count({ where: { userId: user!.id, completed: true } });
    const masteredFlashcards = await db.flashcard.count({ where: { userId: user!.id, mastered: true } });
    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0);

    return NextResponse.json({
      overview: {
        totalStudySessions: totalStudyLogs,
        monthlyMinutes: totalMinutes,
        weeklyMinutes,
        topics,
        flashcards,
        goals,
        pendingRevisions: revisions,
        completedGoals,
        masteredFlashcards,
        totalFocusMinutes,
      },
      level: {
        current: level,
        xp: user!.xp,
        xpProgress: Math.min(xpProgress, 100),
        streak: user!.streak,
        longestStreak: user!.longestStreak,
      },
      weeklyData,
      moodData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
