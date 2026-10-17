import { cardForScore, JudgeRequest, Verdict } from '@/lib/ai/schema';

const verdict: Verdict = {
  isOutfit: true,
  score: 7.5,
  card: 'green',
  title: 'Dengeli Smart Casual',
  commentary: 'Lacivert blazer işini biliyor.',
  categories: { colorHarmony: 8, fit: 7, occasion: 8, creativity: 6 },
  pros: ['Renkler uyumlu'],
  cons: ['Ayakkabı sönük'],
  suggestions: ['Beyaz sneaker dene'],
  detectedItems: ['lacivert blazer'],
};

describe('Verdict', () => {
  it('accepts a valid verdict', () => {
    expect(Verdict.safeParse(verdict).success).toBe(true);
  });

  it('rejects a score that is not a half step', () => {
    expect(Verdict.safeParse({ ...verdict, score: 7.3 }).success).toBe(false);
  });

  it('rejects a score outside 1-10', () => {
    expect(Verdict.safeParse({ ...verdict, score: 0 }).success).toBe(false);
    expect(Verdict.safeParse({ ...verdict, score: 10.5 }).success).toBe(false);
  });

  it('rejects more than three pros', () => {
    expect(Verdict.safeParse({ ...verdict, pros: ['a', 'b', 'c', 'd'] }).success).toBe(false);
  });

  it('rejects an unknown card', () => {
    expect(Verdict.safeParse({ ...verdict, card: 'blue' }).success).toBe(false);
  });
});

describe('JudgeRequest', () => {
  it('rejects an empty image', () => {
    expect(JudgeRequest.safeParse({ imageBase64: '' }).success).toBe(false);
  });

  it('rejects an image larger than 1.5 MB', () => {
    const imageBase64 = 'a'.repeat(2 * 1024 * 1024 + 1);
    expect(JudgeRequest.safeParse({ imageBase64 }).success).toBe(false);
  });
});

describe('cardForScore', () => {
  it.each([
    [1, 'red'],
    [3.5, 'red'],
    [4, 'yellow'],
    [6.5, 'yellow'],
    [7, 'green'],
    [8.5, 'green'],
    [9, 'golden'],
    [10, 'golden'],
  ])('gives %s a %s card', (score, card) => {
    expect(cardForScore(score)).toBe(card);
  });
});
