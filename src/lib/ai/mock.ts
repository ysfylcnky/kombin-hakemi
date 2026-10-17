import type { Verdict } from '@/lib/ai/schema';

const verdict: Verdict = {
  isOutfit: true,
  score: 7.5,
  card: 'green',
  title: 'Ofisin Sessiz Kahramanı',
  commentary:
    'Ve sahneye çıkıyor! Lacivert blazer orta sahayı tek başına taşıyor. Ayakkabılar biraz yedek kulübesinde kalmış ama skor tabelası gülümsüyor.',
  categories: { colorHarmony: 8, fit: 7.5, occasion: 8, creativity: 6 },
  pros: ['Renkler birbirini tamamlıyor', 'Blazer duruşu toparlıyor'],
  cons: ['Ayakkabılar sönük kalmış'],
  suggestions: ['Beyaz sneaker ile dene', 'İnce bir kemer ekle'],
  detectedItems: ['lacivert blazer', 'beyaz gömlek', 'gri pantolon', 'siyah ayakkabı'],
};

export async function mockVerdict() {
  // Simulate model latency so loading states are visible during development.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return verdict;
}
