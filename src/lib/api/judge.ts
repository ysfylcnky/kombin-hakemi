import type { JudgeRequest, Verdict } from '@/lib/ai/schema';

// A per-session id is enough for the server's in-memory rate limit.
const deviceId = Math.random().toString(36).slice(2);

const errorMessages: Record<number, string> = {
  400: 'Fotoğraf okunamadı, tekrar dene.',
  429: 'Çok sık istek gönderdin, bir dakika sonra tekrar dene.',
};

export async function judgeOutfit(request: JudgeRequest): Promise<Verdict> {
  const res = await fetch('/api/judge', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-device-id': deviceId },
    body: JSON.stringify(request),
  }).catch(() => {
    throw new Error('Bağlantı kurulamadı, internetini kontrol et.');
  });
  if (!res.ok) throw new Error(errorMessages[res.status] ?? 'Değerlendirme şu an yapılamadı, tekrar dene.');
  return res.json();
}
