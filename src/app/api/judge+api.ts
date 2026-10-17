import { judgeWithClaude } from '@/lib/ai/claude';
import { mockVerdict } from '@/lib/ai/mock';
import { systemPrompt } from '@/lib/ai/prompts';
import { JudgeRequest } from '@/lib/ai/schema';

export async function POST(request: Request) {
  const { imageBase64, persona, harshness } = JudgeRequest.parse(await request.json());
  if (process.env.AI_MOCK === '1') return Response.json(await mockVerdict());
  return Response.json(await judgeWithClaude(systemPrompt(persona, harshness), imageBase64));
}
