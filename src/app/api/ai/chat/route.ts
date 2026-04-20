import { NextResponse } from 'next/server';
import { getAuthUser, requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { message, history } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const systemPrompt = `You are an AI Study Coach for a student. Your role:
- Help students plan their study sessions effectively
- Suggest study techniques (Pomodoro, spaced repetition, active recall, etc.)
- Motivate and encourage students
- Provide academic guidance and tips
- Be warm, supportive, and practical
- Keep responses concise and actionable

Student info: Level ${user!.level}, ${user!.xp} XP, ${user!.streak}-day streak.
${user!.streak === 0 ? "They haven't started studying yet - encourage them to begin!" : user!.streak < 3 ? "They're just getting started - encourage consistency!" : "They're on a great streak - celebrate and keep them going!"}`;

    const messages: any[] = [
      { role: 'assistant', content: systemPrompt },
    ];

    if (history && Array.isArray(history)) {
      messages.push(...history.slice(-10));
    }

    messages.push({ role: 'user', content: message });

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content || 'I\'m here to help! What would you like to work on?';

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'AI service temporarily unavailable', response: 'I\'m having trouble connecting right now. Please try again in a moment.' }, { status: 500 });
  }
}
