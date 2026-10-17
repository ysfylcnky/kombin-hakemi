import type { ModelVerdict } from '@/lib/ai/schema';

const verdict: ModelVerdict = {
  isOutfit: true,
  title: 'Dengeli Ama Sönük Smart Casual',
  commentary:
    'Lacivert blazer ile gri pantolon doğru bir temel kuruyor. Ancak siyah ayakkabı ve kahverengi kemer aynı kombinde çatışıyor ve bütünlüğü bozuyor. Pantolon paçası fazla uzun, siluet ağırlaşıyor.',
  criteria: {
    colorHarmony: { observation: 'Lacivert ve gri uyumlu, beyaz gömlek kontrastı zayıf bırakıyor.', score: 5 },
    proportion: { observation: 'Blazer boyu doğru, uzun paça bacağı kısaltıyor.', score: 6 },
    fit: { observation: 'Blazer omuzda oturuyor, pantolon paçada kırışık biriktiriyor.', score: 6 },
    formality: { observation: 'Blazer ve gömlek smart casual çizgisini tutarlı kuruyor.', score: 7 },
    footwearAccessories: { observation: 'Siyah ayakkabı ile kahverengi kemer tonu çatışıyor.', score: 3 },
    focalPoint: { observation: 'Belirgin bir odak yok, kombin dağınık okunuyor.', score: 5 },
    texture: { observation: 'Yün blazer ile pamuk gömlek dengeli ama sıradan.', score: 6 },
    pattern: { observation: 'Desen yok, düz parçalar.', score: null },
    grooming: { observation: 'Parçalar ütülü ve temiz görünüyor.', score: 7 },
  },
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
