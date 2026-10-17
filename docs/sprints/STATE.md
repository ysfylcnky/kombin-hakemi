# Sprint durumu

Aktif: S04 (devam, 5/6) · Sonraki: S05 · Son güncelleme: 2026-10-17
Aktif sprint başlangıç commit'i: 5de1b37

## Taşınan işler
-

## Kalıcı kararlar
- Kod `src/` altında: ekranlar `src/app`, `@/*` → `src/*`; PRODUCT'taki `app/...` yolları buna göre okunur.
- Stil yalnızca `useTheme()` (`colors`, `space`, `radius`, `typography`); font ağırlığı `fontFamily` ile.
- Hedef yalnızca iPhone + Android (Expo Go); web'e özel kod yazılmaz.
- Kamera üstü katman temadan bağımsız `colors.dark` kullanır (önizleme hep koyu).
- Görsel istemcide `prepareImage` ile 1024px JPEG'e küçültülüp base64 gönderilir.
- AI sağlayıcı OpenAI Responses API (`gpt-6-luna`, strict JSON Schema); `OPENAI_API_KEY` yalnızca sunucuda, `AI_MOCK=1` anahtarsız.
- Tek hakem: ciddi ve sert stil danışmanı; persona/sertlik seçimi yok; detaylı rapor sayfası S04'te.
- İstek ve AI yanıtı `lib/ai/schema.ts` zod şemalarıyla doğrulanır; kart sunucuda puandan hesaplanır.

## Son sprintler
- S03: /api/judge, OpenAI görsel karar, zod şema, mock, rate limit, istemci hook'u · etiket sprint-03
- S02: kamera, izin akışı, galeri, önizleme, görsel sıkıştırma, zamanlayıcı · etiket sprint-02
