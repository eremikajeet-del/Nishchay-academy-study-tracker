import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const goals = await db.goal.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goals);
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
    const { title, description, targetDate } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    const goal = await db.goal.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        userId: user!.id,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id, completed, title, description, targetDate } = await request.json();

    const data: any = {};
    if (completed !== undefined) data.completed = completed;
    if (title) data.title = title;
    if (description !== undefined) data.description = description;
    if (targetDate !== undefined) data.targetDate = targetDate ? new Date(targetDate) : null;

    const goal = await db.goal.update({
      where: { id, userId: user!.id },
      data,
    });

    if (completed) {
      await db.user.update({
        where: { id: user!.id },
        data: { xp: { increment: 25 } },
      });
    }

    return NextResponse.json(goal);
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
    await db.goal.delete({ where: { id, userId: user!.id } });

    return NextResponse.json({ message: 'Goal deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
