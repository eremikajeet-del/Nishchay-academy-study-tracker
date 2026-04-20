import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const topics = await db.topic.findMany({
      where: { userId: user!.id },
      include: {
        _count: { select: { studyLogs: true, flashcards: true, revisions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(topics);
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
    const { name, description, color, parentId, folderId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Topic name required' }, { status: 400 });
    }

    const topic = await db.topic.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#10b981',
        parentId: parentId || null,
        folderId: folderId || null,
        userId: user!.id,
      },
    });

    await db.user.update({
      where: { id: user!.id },
      data: { xp: { increment: 10 } },
    });

    return NextResponse.json(topic, { status: 201 });
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
    await db.topic.delete({ where: { id, userId: user!.id } });

    return NextResponse.json({ message: 'Topic deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
