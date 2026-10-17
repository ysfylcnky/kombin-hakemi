import { z } from 'zod';

import { systemPrompt } from '@/lib/ai/prompts';
import { type JudgeRequest, ModelVerdict, occasionLabels } from '@/lib/ai/schema';

// Strict structured outputs reject maxLength; zod still enforces it on the reply.
const schema = z.toJSONSchema(ModelVerdict, {
  override: ({ jsonSchema }) => {
    delete jsonSchema.maxLength;
  },
});

type ResponsesOutput = { output: { type: string; content?: { type: string; text?: string }[] }[] };

async function callOpenAI({ imageBase64, occasion }: JudgeRequest, signal: AbortSignal) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'gpt-6-luna',
      instructions: systemPrompt,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_image', image_url: `data:image/jpeg;base64,${imageBase64}` },
            { type: 'input_text', text: `Ortam: ${occasionLabels[occasion]}. Bu kombini değerlendir.` },
          ],
        },
      ],
      text: { format: { type: 'json_schema', name: 'hakem_karari', schema, strict: true } },
    }),
    signal,
  });
  if (!res.ok) throw new Error(`OpenAI responded ${res.status}`);
  const data: ResponsesOutput = await res.json();
  const text = data.output
    .find((item) => item.type === 'message')
    ?.content?.find((part) => part.type === 'output_text')?.text;
  return text ? JSON.parse(text) : undefined;
}

export async function judgeWithOpenAI(request: JudgeRequest) {
  // One deadline for both attempts so the client never waits more than 25 s.
  const signal = AbortSignal.timeout(25_000);
  for (let attempt = 0; attempt < 2; attempt++) {
    const verdict = ModelVerdict.safeParse(await callOpenAI(request, signal));
    if (verdict.success) return verdict.data;
  }
  throw new Error('OpenAI returned an invalid verdict');
}
