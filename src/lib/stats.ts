import { type Criteria, criterionLabels } from '@/lib/ai/schema';
import type { Outfit } from '@/lib/db/outfits';

const WEEKS = 6;

const mean = (values: number[]) =>
  Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10;

export function summarize(outfits: Outfit[]) {
  if (outfits.length === 0) return null;
  const byScore = [...outfits].sort((a, b) => b.verdict.score - a.verdict.score);
  return { average: mean(outfits.map((o) => o.verdict.score)), best: byScore[0], worst: byScore.at(-1)! };
}

// Calendar arithmetic rather than fixed 7-day offsets, so DST shifts don't move week boundaries.
function weekStart(time: number) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

export function weeklyAverages(outfits: Outfit[], now: number) {
  const current = weekStart(now);
  return Array.from({ length: WEEKS }, (_, i) => {
    const start = new Date(current);
    start.setDate(current.getDate() - 7 * (WEEKS - 1 - i));
    const scores = outfits
      .filter((o) => weekStart(o.createdAt).getTime() === start.getTime())
      .map((o) => o.verdict.score);
    return { weekStart: start.getTime(), average: scores.length > 0 ? mean(scores) : null };
  });
}

export function strongestAndWeakest(outfits: Outfit[]) {
  if (outfits.length === 0) return null;
  const averages = (Object.keys(criterionLabels) as (keyof Criteria)[])
    .flatMap((key) => {
      const scores = outfits.flatMap((o) => o.verdict.criteria[key].score ?? []);
      return scores.length > 0 ? [{ key, average: mean(scores) }] : [];
    })
    .sort((a, b) => b.average - a.average);
  return { strongest: averages[0], weakest: averages.at(-1)! };
}
