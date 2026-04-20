import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const [achievements, userAchievements] = await Promise.all([
      db.achievement.findMany(),
      db.userAchievement.findMany({
        where: { userId: user!.id },
        include: { achievement: true },
      }),
    ]);

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

    return NextResponse.json({
      achievements: achievements.map(a => ({
        ...a,
        unlocked: unlockedIds.has(a.id),
        unlockedAt: userAchievements.find(ua => ua.achievementId === a.id)?.unlockedAt || null,
      })),
      totalUnlocked: userAchievements.length,
      totalAchievements: achievements.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const [topicCount, studyLogCount, flashcardCount, focusCount, quizCount] = await Promise.all([
      db.topic.count({ where: { userId: user!.id } }),
      db.studyLog.count({ where: { userId: user!.id } }),
      db.flashcard.count({ where: { userId: user!.id } }),
      db.focusSession.count({ where: { userId: user!.id, completed: true } }),
      db.quiz.count({ where: { userId: user!.id, completedAt: { not: null } } }),
    ]);

    const checks: Record<string, boolean> = {
      'first-topic': topicCount >= 1,
      'three-day-streak': user!.streak >= 3,
      'first-focus': focusCount >= 1,
      'ten-flashcards': flashcardCount >= 10,
      'first-quiz': quizCount >= 1,
      'seven-day-streak': user!.streak >= 7,
      'level-ten': user!.level >= 10,
      'first-session': studyLogCount >= 1,
    };

    const newlyUnlocked: string[] = [];

    for (const [achievementName, condition] of Object.entries(checks)) {
      if (condition) {
        const achievement = await db.achievement.findFirst({ where: { name: achievementName } });
        if (achievement) {
          const existing = await db.userAchievement.findFirst({
            where: { userId: user!.id, achievementId: achievement.id },
          });
          if (!existing) {
            await db.userAchievement.create({
              data: { userId: user!.id, achievementId: achievement.id },
            });
            newlyUnlocked.push(achievement.name);
            if (achievement.xpReward > 0) {
              await db.user.update({
                where: { id: user!.id },
                data: { xp: { increment: achievement.xpReward } },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ newlyUnlocked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
