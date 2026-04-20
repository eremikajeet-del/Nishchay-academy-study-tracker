import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const folders = await db.folder.findMany({
      where: { userId: user!.id },
      include: {
        _count: { select: { topics: true, children: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(folders);
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
    const { name, description, parentId, icon } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const folder = await db.folder.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        parentId: parentId || null,
        icon: icon || null,
        userId: user!.id,
      },
    });

    return NextResponse.json(folder, { status: 201 });
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
    await db.folder.delete({ where: { id, userId: user!.id } });

    return NextResponse.json({ message: 'Folder deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
