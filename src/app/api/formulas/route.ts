import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const formulas = await db.formula.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(formulas);
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
    const { name, formula, description, category, topicId } = body;

    if (!name?.trim() || !formula?.trim()) {
      return NextResponse.json({ error: 'Name and formula required' }, { status: 400 });
    }

    const newFormula = await db.formula.create({
      data: {
        name: name.trim(),
        formula: formula.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        topicId: topicId || null,
        userId: user!.id,
      },
    });

    return NextResponse.json(newFormula, { status: 201 });
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
    await db.formula.delete({ where: { id, userId: user!.id } });

    return NextResponse.json({ message: 'Formula deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
