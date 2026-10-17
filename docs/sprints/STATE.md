# Sprint durumu

Aktif: yok · Sonraki: yok (9 sprintlik plan tamamlandı, v1.0.0) · Son güncelleme: 2026-10-17
Aktif sprint başlangıç commit'i: -

## Taşınan işler
-

## Kalıcı kararlar
- Görsel istemcide `prepareImage` ile 1024px JPEG'e küçültülüp base64 gönderilir.
- AI sağlayıcı OpenAI Responses API (`gpt-6-luna`, strict JSON Schema); `OPENAI_API_KEY` yalnızca sunucuda, `AI_MOCK=1` anahtarsız.
- Ürün adı **Prova**; futbol/hakem metaforu ve ironi yok. Slug, scheme ve kod içi `judge` adları kalır.
- Tek değerlendirici: ciddi ve sert stil danışmanı; persona/sertlik seçimi yok.
- İstek ve AI yanıtı `lib/ai/schema.ts` zod şemalarıyla doğrulanır; AI yalnızca 9 kriteri puanlar, toplam puan ve seviye sunucuda hesaplanır.
- Sonuç ekranı `sonuc.tsx` (param `uri`, `occasion`) isteği kendisi atar; halka `react-native-svg`, hareketi azalt Reanimated varsayılanıyla.
- Dolap `expo-sqlite` `prova.db` / `outfits` (karar JSON + score/level sütunu, `user_version` migration); fotoğraf `Paths.document/outfits`, DB'de yalnızca dosya adı.
- Tema tercihi `Appearance.setColorScheme` ile uygulanır, `expo-sqlite/kv-store` `theme` anahtarında saklanır; `useTheme` değişmez.
- kv-store anahtarları: `reminder` (on/off, 7 günlük tek seferlik 19:00 bildirimleri `syncReminders` kurar), `onboarded` (ilk açılış tanıtımı).
- API canlıda `https://prova.expo.app` (EAS Hosting, `@ysfylcnky1/kombin-hakemi`); deploy: `npx expo export -p web` + `npx eas-cli deploy --prod --environment production` (kullanıcı terminalinden). Expo Go dev sunucusunu kullanır, `origin` yalnızca production derlemede.

## Son sprintler
- S09: yayın ve demo; test planı, API canlıda (EAS Hosting), README, demo akışı, v1.0.0 · etiket sprint-09
- S08–S09 arası: ana sayfa yeniden tasarımı; son prova kartı, çekim ipuçları, butonlar altta · sprint dışı
