import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (!q?.trim()) {
      return NextResponse.json({ topics: [], flashcards: [], formulas: [] });
    }

    const [topics, flashcards, formulas] = await Promise.all([
      db.topic.findMany({
        where: { userId: user!.id, name: { contains: q } },
        take: 5,
      }),
      db.flashcard.findMany({
        where: {
          userId: user!.id,
          OR: [
            { front: { contains: q } },
            { back: { contains: q } },
            { tag: { contains: q } },
          ],
        },
        take: 5,
      }),
      db.formula.findMany({
        where: {
          userId: user!.id,
          OR: [
            { name: { contains: q } },
            { formula: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({ topics, flashcards, formulas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
