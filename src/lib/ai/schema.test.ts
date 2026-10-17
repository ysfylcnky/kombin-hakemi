import {
  type Criteria,
  JudgeRequest,
  levelForScore,
  ModelVerdict,
  scoreCriteria,
} from '@/lib/ai/schema';

function criteria(score: number, overrides: Partial<Record<keyof Criteria, number | null>> = {}) {
  const keys: (keyof Criteria)[] = [
    'colorHarmony',
    'proportion',
    'fit',
    'formality',
    'footwearAccessories',
    'focalPoint',
    'texture',
    'pattern',
    'grooming',
  ];
  return Object.fromEntries(
    keys.map((key) => [key, { observation: 'gözlem', score: key in overrides ? overrides[key] : score }]),
  ) as Criteria;
}

const verdict: ModelVerdict = {
  isOutfit: true,
  title: 'Dengeli Smart Casual',
  commentary: 'Lacivert blazer işini biliyor.',
  criteria: criteria(7),
  pros: ['Renkler uyumlu'],
  cons: ['Ayakkabı sönük'],
  suggestions: ['Beyaz sneaker dene'],
  detectedItems: ['lacivert blazer'],
};

describe('ModelVerdict', () => {
  it('accepts a valid verdict', () => {
    expect(ModelVerdict.safeParse(verdict).success).toBe(true);
  });

  it('accepts a null pattern score', () => {
    const withoutPattern = { ...verdict, criteria: { ...verdict.criteria, pattern: { observation: '', score: null } } };
    expect(ModelVerdict.safeParse(withoutPattern).success).toBe(true);
  });

  it('rejects a null score on other criteria', () => {
    const broken = { ...verdict, criteria: { ...verdict.criteria, fit: { observation: '', score: null } } };
    expect(ModelVerdict.safeParse(broken).success).toBe(false);
  });

  it('rejects a criterion score that is not a whole number in 0-10', () => {
    for (const score of [6.5, -1, 11]) {
      const broken = { ...verdict, criteria: { ...verdict.criteria, fit: { observation: '', score } } };
      expect(ModelVerdict.safeParse(broken).success).toBe(false);
    }
  });

  it('rejects more than three pros', () => {
    expect(ModelVerdict.safeParse({ ...verdict, pros: ['a', 'b', 'c', 'd'] }).success).toBe(false);
  });
});

describe('JudgeRequest', () => {
  it('rejects an empty image', () => {
    expect(JudgeRequest.safeParse({ imageBase64: '', occasion: 'casual' }).success).toBe(false);
  });

  it('rejects an unknown occasion', () => {
    expect(JudgeRequest.safeParse({ imageBase64: 'abc', occasion: 'beach' }).success).toBe(false);
  });

  it('rejects an image larger than 1.5 MB', () => {
    const imageBase64 = 'a'.repeat(2 * 1024 * 1024 + 1);
    expect(JudgeRequest.safeParse({ imageBase64, occasion: 'casual' }).success).toBe(false);
  });
});

describe('scoreCriteria', () => {
  it('returns the common score when all criteria agree', () => {
    expect(scoreCriteria(criteria(8))).toBe(8);
  });

  it('weights colour harmony more than grooming', () => {
    expect(scoreCriteria(criteria(6, { colorHarmony: 10 }))).toBe(6.8);
    expect(scoreCriteria(criteria(6, { grooming: 10 }))).toBe(6.2);
  });

  it('ignores a null pattern instead of counting it as zero', () => {
    expect(scoreCriteria(criteria(8, { pattern: null }))).toBe(8);
  });

  it('caps the total at the weakest criterion plus three', () => {
    expect(scoreCriteria(criteria(9, { grooming: 2 }))).toBe(5);
  });

  it('does not cap when the weakest criterion is above three', () => {
    expect(scoreCriteria(criteria(9, { grooming: 4 }))).toBe(8.8);
  });

  it('rounds to one decimal', () => {
    expect(scoreCriteria(criteria(7, { texture: 8 }))).toBe(7.1);
  });
});

describe('levelForScore', () => {
  it.each([
    [0, 'weak'],
    [3.9, 'weak'],
    [4, 'developing'],
    [5.9, 'developing'],
    [6, 'good'],
    [7.4, 'good'],
    [7.5, 'veryGood'],
    [8.9, 'veryGood'],
    [9, 'flawless'],
    [10, 'flawless'],
  ])('puts %s at %s', (score, level) => {
    expect(levelForScore(score)).toBe(level);
  });
});
