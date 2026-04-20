import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const url = new URL(request.url);
    const topicId = url.searchParams.get('topicId');

    const where: any = { userId: user!.id };
    if (topicId) where.topicId = topicId;

    const flashcards = await db.flashcard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(flashcards);
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
    const { front, back, tag, topicId } = body;

    if (!front?.trim() || !back?.trim()) {
      return NextResponse.json({ error: 'Front and back required' }, { status: 400 });
    }

    const flashcard = await db.flashcard.create({
      data: {
        front: front.trim(),
        back: back.trim(),
        tag: tag?.trim() || null,
        topicId: topicId || null,
        userId: user!.id,
      },
    });

    await db.user.update({
      where: { id: user!.id },
      data: { xp: { increment: 5 } },
    });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id, mastered, front, back, tag } = await request.json();

    const data: any = {};
    if (mastered !== undefined) data.mastered = mastered;
    if (front) data.front = front;
    if (back) data.back = back;
    if (tag !== undefined) data.tag = tag;

    const flashcard = await db.flashcard.update({
      where: { id, userId: user!.id },
      data,
    });

    return NextResponse.json(flashcard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await request.json();
    await db.flashcard.delete({ where: { id, userId: user!.id } });

    return NextResponse.json({ message: 'Flashcard deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
