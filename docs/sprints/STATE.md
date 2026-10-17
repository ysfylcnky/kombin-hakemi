# Sprint durumu

Aktif: S06 (devam, 5/6) · Son güncelleme: 2026-10-17
Aktif sprint başlangıç commit'i: 2d2412f

## Taşınan işler
-

## Kalıcı kararlar
- Kod `src/` altında: ekranlar `src/app`, `@/*` → `src/*`; PRODUCT'taki `app/...` yolları buna göre okunur.
- Stil yalnızca `useTheme()` (`colors`, `space`, `radius`, `typography`); font ağırlığı `fontFamily` ile; palet kum / koyu kahve / camel, pembe-bordo yok.
- Hedef yalnızca iPhone + Android (Expo Go); web'e özel kod yazılmaz.
- Kamera üstü katman temadan bağımsız `colors.dark` kullanır (önizleme hep koyu).
- Görsel istemcide `prepareImage` ile 1024px JPEG'e küçültülüp base64 gönderilir.
- AI sağlayıcı OpenAI Responses API (`gpt-6-luna`, strict JSON Schema); `OPENAI_API_KEY` yalnızca sunucuda, `AI_MOCK=1` anahtarsız.
- Ürün adı **Prova**; futbol/hakem metaforu ve ironi yok. Slug, scheme ve kod içi `judge` adları kalır.
- Tek değerlendirici: ciddi ve sert stil danışmanı; persona/sertlik seçimi yok.
- İstek ve AI yanıtı `lib/ai/schema.ts` zod şemalarıyla doğrulanır; AI yalnızca 9 kriteri puanlar, toplam puan ve seviye sunucuda hesaplanır.
- Sonuç ekranı `sonuc.tsx` (param `uri`, `occasion`) isteği kendisi atar; halka `react-native-svg`, hareketi azalt Reanimated varsayılanıyla.

## Son sprintler
- S05: Prova; 9 kriterli sunucu puanı, seviye, ortam seçimi, kriter dökümü, kum-camel tema · etiket sprint-05
- S04: sonuç ekranı, puan halkası, hakem kartı, stil raporu, hata/tekrar dene · etiket sprint-04
