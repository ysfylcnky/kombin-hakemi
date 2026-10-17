import type { Verdict } from '@/lib/ai/schema';
import { badges } from '@/lib/badges';
import type { Outfit } from '@/lib/db/outfits';

const outfit = (createdAt: number, score: number, colorHarmony = 5): Outfit => ({
  id: createdAt,
  photo: `${createdAt}.jpg`,
  occasion: 'casual',
  verdict: { score, level: 'good', criteria: { colorHarmony: { score: colorHarmony } } } as Verdict,
  favorite: false,
  createdAt,
});

const earned = (outfits: Outfit[]) => badges(outfits).filter((b) => b.earned).map((b) => b.label);

// Oldest first: scores[0] has createdAt 1.
const series = (scores: number[]) => scores.map((score, i) => outfit(i + 1, score));

describe('badges', () => {
  it('earns nothing without outfits', () => {
    expect(earned([])).toEqual([]);
  });

  it('earns İlk Prova with the first outfit', () => {
    expect(earned([outfit(1, 5)])).toEqual(['İlk Prova']);
  });

  it('needs three outfits with colour harmony 8 or more for Renk Ustası', () => {
    expect(earned([outfit(1, 5, 8), outfit(2, 5, 9)])).not.toContain('Renk Ustası');
    expect(earned([outfit(1, 5, 8), outfit(2, 5, 9), outfit(3, 5, 10)])).toContain('Renk Ustası');
  });

  it('earns Kusursuz from a 9', () => {
    expect(earned([outfit(1, 8.9)])).not.toContain('Kusursuz');
    expect(earned([outfit(1, 9)])).toContain('Kusursuz');
  });

  it('needs ten outfits for Yükselişte', () => {
    expect(earned(series([1, 1, 1, 1, 9, 9, 9, 9, 9]))).not.toContain('Yükselişte');
  });

  it('earns Yükselişte on an exact 1-point rise despite float drift', () => {
    expect(earned(series([6.3, 6.3, 6.3, 6.3, 6.3, 7.3, 7.3, 7.3, 7.3, 7.3]))).toContain('Yükselişte');
    expect(earned(series([6.3, 6.3, 6.3, 6.3, 6.3, 7.2, 7.2, 7.2, 7.2, 7.2]))).not.toContain('Yükselişte');
  });

  it('compares by date, not by input order', () => {
    const rising = series([5, 5, 5, 5, 5, 7, 7, 7, 7, 7]);
    expect(earned([...rising].reverse())).toContain('Yükselişte');
    const falling = series([7, 7, 7, 7, 7, 5, 5, 5, 5, 5]);
    expect(earned(falling)).not.toContain('Yükselişte');
  });
});
