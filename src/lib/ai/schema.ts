import { z } from 'zod';

export const JudgeRequest = z.object({
  // 1.5 MB of JPEG is 2 MiB of base64 (4 chars per 3 bytes).
  imageBase64: z.string().min(1).max(2 * 1024 * 1024),
  occasion: z.enum(['casual', 'business', 'formal', 'sport']),
});

const observation = z.string().max(120);
const score = z.number().int().min(0).max(10);
// Observation comes first so the model describes what it sees before scoring it.
const criterion = z.object({ observation, score });

export const ModelVerdict = z.object({
  isOutfit: z.boolean(),
  title: z.string().max(40),
  commentary: z.string().max(400),
  criteria: z.object({
    colorHarmony: criterion,
    proportion: criterion,
    fit: criterion,
    formality: criterion,
    footwearAccessories: criterion,
    focalPoint: criterion,
    texture: criterion,
    // Null when the outfit has no pattern, so plain outfits aren't penalised.
    pattern: z.object({ observation, score: score.nullable() }),
    grooming: criterion,
  }),
  pros: z.array(z.string().max(80)).max(3),
  cons: z.array(z.string().max(80)).max(3),
  suggestions: z.array(z.string().max(100)).max(3),
  detectedItems: z.array(z.string().max(30)).max(8),
});

export type JudgeRequest = z.infer<typeof JudgeRequest>;
export type ModelVerdict = z.infer<typeof ModelVerdict>;
export type Criteria = ModelVerdict['criteria'];
export type Level = 'weak' | 'developing' | 'good' | 'veryGood' | 'flawless';
export type Verdict = ModelVerdict & { score: number; level: Level };

export const occasionLabels: Record<JudgeRequest['occasion'], string> = {
  casual: 'Günlük',
  business: 'İş',
  formal: 'Davet',
  sport: 'Spor',
};

export const levelLabels: Record<Level, string> = {
  weak: 'Zayıf',
  developing: 'Geliştirilmeli',
  good: 'İyi',
  veryGood: 'Çok iyi',
  flawless: 'Kusursuz',
};

export const levelColor = {
  weak: 'levelWeak',
  developing: 'levelDeveloping',
  good: 'levelGood',
  veryGood: 'levelVeryGood',
  flawless: 'levelFlawless',
} as const;

export const criterionLabels: Record<keyof Criteria, string> = {
  colorHarmony: 'Renk uyumu',
  proportion: 'Oran ve siluet',
  fit: 'Kalıp ve oturuş',
  formality: 'Formalite tutarlılığı',
  footwearAccessories: 'Ayakkabı ve aksesuar',
  focalPoint: 'Odak noktası ve bütünlük',
  texture: 'Doku ve kumaş',
  pattern: 'Desen kullanımı',
  grooming: 'Bakım ve özen',
};

const weights: Record<keyof Criteria, number> = {
  colorHarmony: 20,
  proportion: 15,
  fit: 15,
  formality: 12,
  footwearAccessories: 10,
  focalPoint: 10,
  texture: 8,
  pattern: 5,
  grooming: 5,
};

export function scoreCriteria(criteria: Criteria) {
  let total = 0;
  let weightSum = 0;
  let lowest = 10;
  for (const key of Object.keys(weights) as (keyof Criteria)[]) {
    const { score } = criteria[key];
    if (score === null) continue;
    total += score * weights[key];
    weightSum += weights[key];
    lowest = Math.min(lowest, score);
  }
  const average = total / weightSum;
  // One badly failed criterion sinks the outfit however strong the rest is.
  const capped = lowest <= 3 ? Math.min(average, lowest + 3) : average;
  return Math.round(capped * 10) / 10;
}

export function levelForScore(score: number): Level {
  if (score < 4) return 'weak';
  if (score < 6) return 'developing';
  if (score < 7.5) return 'good';
  if (score < 9) return 'veryGood';
  return 'flawless';
}
