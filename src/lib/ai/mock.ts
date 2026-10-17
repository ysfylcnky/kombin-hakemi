import type { Verdict } from '@/lib/ai/schema';

const verdict: Verdict = {
  isOutfit: true,
  score: 6,
  card: 'yellow',
  title: 'Dengeli Ama Sönük Smart Casual',
  commentary:
    'Lacivert blazer ile gri pantolon doğru bir temel kuruyor. Ancak siyah ayakkabı ve kahverengi kemer aynı kombinde çatışıyor ve bütünlüğü bozuyor. Pantolon paçası fazla uzun, siluet ağırlaşıyor.',
  categories: { colorHarmony: 5.5, fit: 6, occasion: 7, creativity: 4.5 },
  pros: ['Lacivert ve gri temel uyumlu', 'Blazer omuzda doğru oturuyor'],
  cons: ['Kemer ile ayakkabı tonu çatışıyor', 'Paça fazla uzun, kırışık birikiyor'],
  suggestions: [
    'Kahverengi kemeri ayakkabıyla aynı tonda siyah bir kemerle değiştir.',
    'Paçayı bileği hafifçe gösterecek kadar kısalt.',
    'Beyaz gömlek yerine açık mavi gömlekle kontrast kat.',
  ],
  detectedItems: ['lacivert blazer', 'beyaz gömlek', 'gri pantolon', 'siyah ayakkabı', 'kahverengi kemer'],
};

export async function mockVerdict() {
  // Simulate model latency so loading states are visible during development.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return verdict;
}
