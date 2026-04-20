import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const adminExists = await db.user.findFirst({ where: { role: 'admin' } });
    if (adminExists) {
      return NextResponse.json({ message: 'Database already seeded' });
    }

    const hashedPassword = await hashPassword('Mr.Robot');

    await db.user.create({
      data: {
        email: 'eremikajeet@gmail.com',
        username: 'Mr.ADHD',
        password: hashedPassword,
        role: 'admin',
        status: 'approved',
      },
    });

    const achievements = [
      { name: 'first-topic', description: 'Add your first topic', icon: '🎯', category: 'getting-started', xpReward: 10 },
      { name: 'first-session', description: 'Complete your first study session', icon: '📝', category: 'getting-started', xpReward: 10 },
      { name: 'three-day-streak', description: 'Study 3 days in a row', icon: '🔥', category: 'consistency', xpReward: 25 },
      { name: 'first-focus', description: 'Complete a focus session', icon: '⚡', category: 'getting-started', xpReward: 15 },
      { name: 'ten-flashcards', description: 'Create 10 flashcards', icon: '📚', category: 'content', xpReward: 20 },
      { name: 'first-quiz', description: 'Complete your first quiz', icon: '🧠', category: 'getting-started', xpReward: 15 },
      { name: 'seven-day-streak', description: 'Maintain a 7-day streak', icon: '📅', category: 'consistency', xpReward: 50 },
      { name: 'level-ten', description: 'Reach level 10', icon: '💎', category: 'milestone', xpReward: 100 },
    ];

    for (const achievement of achievements) {
      await db.achievement.create({ data: achievement });
    }

    await db.appSetting.create({
      data: { key: 'auto_approve', value: 'false' },
    });

    return NextResponse.json({ message: 'Database seeded successfully!', admin: { email: 'eremikajeet@gmail.com', username: 'Mr.ADHD' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
