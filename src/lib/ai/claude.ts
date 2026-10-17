import { z } from 'zod';

import { Verdict } from '@/lib/ai/schema';

const tool = {
  name: 'hakem_karari',
  description: 'Kombin için verilen hakem kararını kaydeder.',
  input_schema: z.toJSONSchema(Verdict),
};

async function callClaude(system: string, imageBase64: string, signal: AbortSignal) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'claude-haiku-5-5',
      max_tokens: 800,
      system,
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: 'Bu kombini değerlendir.' },
          ],
        },
      ],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Claude responded ${res.status}`);
  const data: { content: { type: string; input?: unknown }[] } = await res.json();
  return data.content.find((block) => block.type === 'tool_use')?.input;
}

export async function judgeWithClaude(system: string, imageBase64: string) {
  // One deadline for both attempts so the client never waits more than 25 s.
  const signal = AbortSignal.timeout(25_000);
  for (let attempt = 0; attempt < 2; attempt++) {
    const verdict = Verdict.safeParse(await callClaude(system, imageBase64, signal));
    if (verdict.success) return verdict.data;
  }
  throw new Error('Claude returned an invalid verdict');
}
