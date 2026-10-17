# Sprint durumu

Aktif: S03 (görevler bitti, kapanış bekliyor) · Son güncelleme: 2026-10-17
Aktif sprint başlangıç commit'i: 53fcc1a

## Taşınan işler
-

## Kalıcı kararlar
- Kod `src/` altında: ekranlar `src/app`, `@/*` → `src/*`; PRODUCT'taki `app/...` yolları buna göre okunur.
- Stil yalnızca `useTheme()` (`colors`, `space`, `radius`, `typography`); font ağırlığı `fontFamily` ile.
- Hedef yalnızca iPhone + Android (Expo Go); web'e özel kod yazılmaz.
- Kamera üstü katman temadan bağımsız `colors.dark` kullanır (önizleme hep koyu).
- Görsel istemcide `prepareImage` ile 1024px JPEG'e küçültülüp base64 gönderilir.

## Son sprintler
- S02: kamera, izin akışı, galeri, önizleme, görsel sıkıştırma, zamanlayıcı · etiket sprint-02
- S01: iskelet, tokenlar, temel bileşenler, 4 sekme, lint + jest · etiket sprint-01
