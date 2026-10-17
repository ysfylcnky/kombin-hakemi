import type { Level, Verdict } from '@/lib/ai/schema';
import { filterOutfits, parseOutfit, type Outfit, type OutfitFilter } from '@/lib/db/outfits';

const outfit = (id: number, score: number, level: Level, favorite = false): Outfit => ({
  id,
  photo: `${id}.jpg`,
  occasion: 'casual',
  verdict: { score, level } as Verdict,
  favorite,
  createdAt: id,
});

const all: OutfitFilter = { favorites: false, level: null, sort: 'date' };
const outfits = [outfit(3, 5, 'developing', true), outfit(2, 8, 'veryGood'), outfit(1, 6.5, 'good', true)];
const ids = (list: Outfit[]) => list.map((o) => o.id);

describe('parseOutfit', () => {
  it('parses verdict JSON and favorite flag, dropping duplicated columns', () => {
    const verdict = { score: 7, level: 'good' } as Verdict;
    expect(
      parseOutfit({
        id: 1,
        photo: '1.jpg',
        occasion: 'business',
        score: 7,
        level: 'good',
        verdict: JSON.stringify(verdict),
        favorite: 1,
        createdAt: 10,
      }),
    ).toEqual({ id: 1, photo: '1.jpg', occasion: 'business', verdict, favorite: true, createdAt: 10 });
  });
});

describe('filterOutfits', () => {
  it('keeps order when nothing is filtered', () => {
    expect(ids(filterOutfits(outfits, all))).toEqual([3, 2, 1]);
  });

  it('keeps only favorites', () => {
    expect(ids(filterOutfits(outfits, { ...all, favorites: true }))).toEqual([3, 1]);
  });

  it('keeps only the chosen level', () => {
    expect(ids(filterOutfits(outfits, { ...all, level: 'veryGood' }))).toEqual([2]);
  });

  it('sorts by score, highest first, without mutating the input', () => {
    expect(ids(filterOutfits(outfits, { ...all, sort: 'score' }))).toEqual([2, 1, 3]);
    expect(ids(outfits)).toEqual([3, 2, 1]);
  });

  it('combines favorites and level', () => {
    expect(ids(filterOutfits(outfits, { ...all, favorites: true, level: 'veryGood' }))).toEqual([]);
  });
});
