import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const settings = await db.appSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const adminError = requireAdmin(user);
    if (adminError) return NextResponse.json({ error: adminError.error }, { status: adminError.status });

    const settings = await request.json();

    for (const [key, value] of Object.entries(settings)) {
      await db.appSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ message: 'Settings updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
