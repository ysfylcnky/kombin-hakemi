import type { Outfit } from '@/lib/db/outfits';

const sum = (outfits: Outfit[]) => outfits.reduce((total, o) => total + o.verdict.score, 0);

export function badges(outfits: Outfit[]) {
  const recent = [...outfits].sort((a, b) => b.createdAt - a.createdAt);
  // Compared in tenths so float drift (e.g. 7.3 - 6.3) can't miss an exact 1-point rise.
  const rise = Math.round(((sum(recent.slice(0, 5)) - sum(recent.slice(5, 10))) / 5) * 10);
  return [
    { label: 'İlk Prova', description: 'İlk kombinini değerlendir.', earned: outfits.length > 0 },
    {
      label: 'Renk Ustası',
      description: 'Üç kombinde renk uyumundan 8 ve üzeri al.',
      earned: outfits.filter((o) => o.verdict.criteria.colorHarmony.score >= 8).length >= 3,
    },
    {
      label: 'Yükselişte',
      description: 'Son 5 kombininin ortalamasını önceki 5 kombine göre 1 puan yükselt.',
      earned: recent.length >= 10 && rise >= 10,
    },
    {
      label: 'Kusursuz',
      description: 'Bir kombinden 9 ve üzeri puan al.',
      earned: outfits.some((o) => o.verdict.score >= 9),
    },
  ];
}
