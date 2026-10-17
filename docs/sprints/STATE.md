# Sprint durumu

Aktif: S08 (devam, 4/6) · Son güncelleme: 2026-10-17
Aktif sprint başlangıç commit'i: 12dd7ad

## Taşınan işler
-

## Kalıcı kararlar
- Hedef yalnızca iPhone + Android (Expo Go); web'e özel kod yazılmaz.
- Kamera üstü katman temadan bağımsız `colors.dark` kullanır (önizleme hep koyu).
- Görsel istemcide `prepareImage` ile 1024px JPEG'e küçültülüp base64 gönderilir.
- AI sağlayıcı OpenAI Responses API (`gpt-6-luna`, strict JSON Schema); `OPENAI_API_KEY` yalnızca sunucuda, `AI_MOCK=1` anahtarsız.
- Ürün adı **Prova**; futbol/hakem metaforu ve ironi yok. Slug, scheme ve kod içi `judge` adları kalır.
- Tek değerlendirici: ciddi ve sert stil danışmanı; persona/sertlik seçimi yok.
- İstek ve AI yanıtı `lib/ai/schema.ts` zod şemalarıyla doğrulanır; AI yalnızca 9 kriteri puanlar, toplam puan ve seviye sunucuda hesaplanır.
- Sonuç ekranı `sonuc.tsx` (param `uri`, `occasion`) isteği kendisi atar; halka `react-native-svg`, hareketi azalt Reanimated varsayılanıyla.
- Dolap `expo-sqlite` `prova.db` / `outfits` (karar JSON + score/level sütunu, `user_version` migration); fotoğraf `Paths.document/outfits`, DB'de yalnızca dosya adı.
- Tema tercihi `Appearance.setColorScheme` ile uygulanır, `expo-sqlite/kv-store` `theme` anahtarında saklanır; `useTheme` değişmez.

## Son sprintler
- S07: karne; istatistik, haftalık bar grafik, rozetler, görsel stil raporu paylaşımı, tema ve veri temizleme ayarları · etiket sprint-07
- S06: dolap; SQLite kayıt, kalıcı fotoğraf, filtreli grid, detay, favori, onaylı silme · etiket sprint-06
