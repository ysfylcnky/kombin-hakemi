import { judgeWithClaude } from '@/lib/ai/claude';
import { systemPrompt } from '@/lib/ai/prompts';
import { JudgeRequest } from '@/lib/ai/schema';

export async function POST(request: Request) {
  const { imageBase64, persona, harshness } = JudgeRequest.parse(await request.json());
  return Response.json(await judgeWithClaude(systemPrompt(persona, harshness), imageBase64));
}
