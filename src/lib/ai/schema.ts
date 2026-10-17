import { z } from 'zod';

export const JudgeRequest = z.object({
  // 1.5 MB of JPEG is 2 MiB of base64 (4 chars per 3 bytes).
  imageBase64: z.string().min(1).max(2 * 1024 * 1024),
});

export const Verdict = z.object({
  isOutfit: z.boolean(),
  score: z.number().min(1).max(10).multipleOf(0.5),
  card: z.enum(['red', 'yellow', 'green', 'golden']),
  title: z.string().max(40),
  commentary: z.string().max(400),
  categories: z.object({
    colorHarmony: z.number().min(0).max(10),
    fit: z.number().min(0).max(10),
    occasion: z.number().min(0).max(10),
    creativity: z.number().min(0).max(10),
  }),
  pros: z.array(z.string().max(80)).max(3),
  cons: z.array(z.string().max(80)).max(3),
  suggestions: z.array(z.string().max(100)).max(3),
  detectedItems: z.array(z.string().max(30)).max(8),
});

export type JudgeRequest = z.infer<typeof JudgeRequest>;
export type Verdict = z.infer<typeof Verdict>;

export function cardForScore(score: number): Verdict['card'] {
  if (score < 4) return 'red';
  if (score < 7) return 'yellow';
  if (score < 9) return 'green';
  return 'golden';
}
