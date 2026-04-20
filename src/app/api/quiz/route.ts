import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const quizzes = await db.quiz.findMany({
      where: { userId: user!.id },
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quizzes);
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
    const { title, topicId, questions } = body;

    if (!title?.trim() || !questions?.length) {
      return NextResponse.json({ error: 'Title and questions required' }, { status: 400 });
    }

    const quiz = await db.quiz.create({
      data: {
        title: title.trim(),
        topicId: topicId || null,
        userId: user!.id,
        totalPoints: questions.length,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            answer: q.answer,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id, score } = await request.json();

    const quiz = await db.quiz.update({
      where: { id, userId: user!.id },
      data: {
        score,
        completedAt: new Date(),
      },
    });

    await db.user.update({
      where: { id: user!.id },
      data: { xp: { increment: score * 5 } },
    });

    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
