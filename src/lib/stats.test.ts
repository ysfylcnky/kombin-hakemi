import { type Criteria, criterionLabels, type Verdict } from '@/lib/ai/schema';
import type { Outfit } from '@/lib/db/outfits';
import { strongestAndWeakest, summarize, weeklyAverages } from '@/lib/stats';

type Scores = Partial<Record<keyof Criteria, number | null>>;

const criteria = (scores: Scores) =>
  Object.fromEntries(
    Object.keys(criterionLabels).map((key) => [
      key,
      { observation: '', score: key in scores ? scores[key as keyof Criteria] : 5 },
    ]),
  ) as Criteria;

const outfit = (id: number, score: number, createdAt = 0, scores: Scores = {}): Outfit => ({
  id,
  photo: `${id}.jpg`,
  occasion: 'casual',
  verdict: { score, level: 'good', criteria: criteria(scores) } as Verdict,
  favorite: false,
  createdAt,
});

describe('summarize', () => {
  it('returns null without outfits', () => {
    expect(summarize([])).toBeNull();
  });

  it('finds average, best and worst', () => {
    const result = summarize([outfit(1, 6), outfit(2, 8.5), outfit(3, 4.2)]);
    expect(result).toMatchObject({ average: 6.2, best: { id: 2 }, worst: { id: 3 } });
  });

  it('uses the single outfit as both best and worst', () => {
    expect(summarize([outfit(1, 7)])).toMatchObject({ average: 7, best: { id: 1 }, worst: { id: 1 } });
  });
});

describe('weeklyAverages', () => {
  const now = new Date(2026, 9, 21, 12).getTime(); // Wednesday

  it('returns six Monday-based weeks, oldest first, empty weeks as null', () => {
    const weeks = weeklyAverages([], now);
    expect(weeks).toHaveLength(6);
    expect(weeks[5].weekStart).toBe(new Date(2026, 9, 19).getTime());
    expect(weeks[0].weekStart).toBe(new Date(2026, 8, 14).getTime());
    expect(weeks.every((w) => w.average === null)).toBe(true);
  });

  it('splits Sunday night and Monday morning into different weeks', () => {
    const weeks = weeklyAverages(
      [
        outfit(1, 6, new Date(2026, 9, 18, 23, 59).getTime()),
        outfit(2, 9, new Date(2026, 9, 19, 0, 0).getTime()),
        outfit(3, 8, new Date(2026, 9, 21, 9).getTime()),
      ],
      now,
    );
    expect(weeks[4].average).toBe(6);
    expect(weeks[5].average).toBe(8.5);
  });

  it('ignores outfits older than six weeks', () => {
    const weeks = weeklyAverages([outfit(1, 6, new Date(2026, 8, 13).getTime())], now);
    expect(weeks.every((w) => w.average === null)).toBe(true);
  });
});

describe('strongestAndWeakest', () => {
  it('returns null without outfits', () => {
    expect(strongestAndWeakest([])).toBeNull();
  });

  it('averages each criterion across outfits', () => {
    const result = strongestAndWeakest([
      outfit(1, 6, 0, { colorHarmony: 9, fit: 2 }),
      outfit(2, 6, 0, { colorHarmony: 8, fit: 3 }),
    ]);
    expect(result).toEqual({
      strongest: { key: 'colorHarmony', average: 8.5 },
      weakest: { key: 'fit', average: 2.5 },
    });
  });

  it('skips unscored pattern values', () => {
    const result = strongestAndWeakest([
      outfit(1, 6, 0, { pattern: null }),
      outfit(2, 6, 0, { pattern: 1 }),
    ]);
    expect(result?.weakest).toEqual({ key: 'pattern', average: 1 });
  });
});
