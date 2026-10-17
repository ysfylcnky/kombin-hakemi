import { judgeWithOpenAI } from '@/lib/ai/openai';
import { mockVerdict } from '@/lib/ai/mock';
import { JudgeRequest, levelForScore, scoreCriteria } from '@/lib/ai/schema';

const recentRequests = new Map<string, number[]>();

function isRateLimited(deviceId: string) {
  const now = Date.now();
  const recent = (recentRequests.get(deviceId) ?? []).filter((time) => now - time < 60_000);
  recent.push(now);
  recentRequests.set(deviceId, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  if (isRateLimited(request.headers.get('x-device-id') ?? 'unknown')) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }
  const body = JudgeRequest.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: 'invalid_request' }, { status: 400 });

  try {
    const verdict =
      process.env.AI_MOCK === '1'
        ? await mockVerdict()
        : await judgeWithOpenAI(body.data.imageBase64);
    const score = scoreCriteria(verdict.criteria);
    return Response.json({ ...verdict, score, level: levelForScore(score) });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    console.error('Judge failed:', error instanceof Error ? error.message : error);
    return Response.json({ error: 'judge_failed' }, { status: timedOut ? 504 : 502 });
  }
}
