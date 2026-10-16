# Kombin Hakemi — Ürün ve Teknik Tasarım

> Kombininin fotoğrafını çek, yapay zekâ hakem sahaya çıksın: puan, unvan, ironik yorum ve kart.
> Mobile Application Development final projesi · Expo + Claude Code skill'leri ile geliştirilir.

## 1. Ürün özeti

| Başlık | Karar |
|---|---|
| Fikir | Kombin fotoğrafını AI hakeme gönder; 10 üzerinden puan, unvan ("Ofisin Sessiz Kahramanı"), hakem yorumu, artı/eksi, öneri |
| İroni | Futbol hakemi metaforu: puana göre **kırmızı / sarı / yeşil kart**, 9+ için **altın top** |
| Hakemler | 👵 Anneanne · 💇 Mahalle Kuaförü · 🎩 Moda Editörü · ⚽ Maç Spikeri |
| Sertlik | Nazik · Dürüst · Acımasız (acımasız bile kişiye değil kıyafete laf atar) |
| Veri | Sadece cihazda (SQLite + dosya sistemi), hesap yok |
| Platform | iOS + Android, Expo Go ile test |
| Kapsam dışı | Hesap/login, bulut senkron, App Store yayını, sosyal akış |

## 2. Teknik yığın

| Katman | Seçim | Neden |
|---|---|---|
| Çatı | Expo (create-expo-app@latest, TypeScript) | Ders gereksinimi |
| Yönlendirme | expo-router (tabs + stack) | Dosya tabanlı, API route desteği |
| Kamera / görsel | expo-camera, expo-image-picker, expo-image-manipulator, expo-image | Çekim, seçim, sıkıştırma, hızlı gösterim |
| AI | Expo Router API route → Claude Messages API (görsel + zorunlu tool çıktısı) | Anahtar sunucuda kalır, JSON garantili |
| Doğrulama | zod (yalnızca sunucuda) | AI yanıtı ve gelen istek sistem sınırı olduğu için |
| İstek durumu | Basit `useJudgeOutfit` hook (useState) | Tek istek için kütüphane gereksiz |
| Yerel veri | expo-sqlite (+ kv-store), expo-file-system | Dolap ve ayarlar cihazda |
| Animasyon / his | react-native-reanimated, expo-haptics | Puan açılışı, kart animasyonu |
| Paylaşım | react-native-view-shot, expo-sharing | "Maç sonu karnesi" görseli |
| Bildirim | expo-notifications (yerel) | Günlük ironik hatırlatma |
| Test / kalite | jest-expo (yalnızca `lib/` saf fonksiyonları), ESLint, tsc | `verify` skill'i her commit öncesi çalıştırır |
| Deploy | EAS Hosting (API), EAS Build (opsiyonel APK) | Demo günü gerçek URL |

## 3. Mimari

```mermaid
flowchart LR
  A[Kamera / Galeri] --> B[Önizleme]
  B -->|1024px JPEG| C[useJudgeOutfit]
  C -->|POST /api/judge| D[API Route]
  D -->|görsel + persona + sertlik| E[Claude API]
  E -->|tool_use JSON| D
  D -->|zod doğrulanmış Verdict| C
  C --> F[Sonuç ekranı]
  F --> G[(SQLite: Dolap)]
  G --> H[Karne / Rozetler]
  F --> I[Paylaşım kartı]
```

## 4. Ekranlar

| Ekran | Dosya | İçerik |
|---|---|---|
| Hakem (sekme) | `app/(tabs)/index.tsx` | Hakem + sertlik seçimi, çek / galeriden seç |
| Kamera | `app/kamera.tsx` | Silüet kılavuzu, ön/arka, 3-2-1 zamanlayıcı |
| Önizleme | `app/onizleme.tsx` | Tekrar çek / hakeme gönder |
| Sonuç | `app/sonuc.tsx` | Yükleme → puan açılışı → kart → detaylar |
| Dolap (sekme) | `app/(tabs)/dolap.tsx` | Kombin galerisi, filtre, favori |
| Kombin detay | `app/kombin/[id].tsx` | Geçmiş karar, favori, sil, paylaş |
| Karne (sekme) | `app/(tabs)/karne.tsx` | Haftalık grafik, en iyi/kötü, rozetler |
| Ayarlar (sekme) | `app/(tabs)/ayarlar.tsx` | Varsayılan hakem, tema, bildirim, veri temizle |
| Onboarding | `app/onboarding.tsx` | İlk açılışta 3 sayfa |
