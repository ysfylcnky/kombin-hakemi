# Demo akışı (5–7 dk)

## Önceden hazırla
- Telefon şarjlı, sessizde, ekran parlaklığı yüksek; Expo Go'nun geliştirici düğmesi gizli.
- Bilgisayarda `.env`: gerçek `OPENAI_API_KEY`, `AI_MOCK` kapalı. `npx expo start` açık, uygulama telefonda yüklü.
- Dolapta 3–4 değerlendirilmiş kombin olsun (karne ve rozetler dolu görünsün).
- Galeride iki fotoğraf: iyi bir tam boy kombin ve kombin olmayan bir şey.
- Tarayıcıda https://prova.expo.app sekmesi ve README açık.

## Akış

| Dk | Ekran | Söylenecek / yapılacak |
|---|---|---|
| 0:00 | — | Problem: "Kombinim olmuş mu?" sorusuna arkadaş yorumu yerine moda ilkelerine dayalı, gerekçeli bir cevap. |
| 0:30 | Ana sayfa | Son prova kartı, çekim ipuçları. "Kombinini çek"e bas. |
| 1:00 | Kamera | Silüet kılavuzu, ön/arka çevirme, 3-2-1 zamanlayıcı. Canlı çekim yap. |
| 1:45 | Önizleme | Ortam seç (İş). Ortam değişince formalite kriterinin beklentisi değişir. Değerlendir. |
| 2:00 | Sonuç | Yükleme mesajları, puan halkası, seviye. Kriterlerin gözlem + puanı; artılar, eksikler, öneriler. |
| 3:00 | Sonuç | Puanı modelin değil sunucunun hesapladığını anlat: ağırlıklı ortalama + zayıf halka tavanı. Stil raporunu paylaş. |
| 3:45 | Galeri | Kombin olmayan fotoğrafı seç: "Kombin bulunamadı", dolaba kaydedilmez. |
| 4:15 | Dolap → detay | Filtreler, favoriye ekleme. Veriler yalnızca cihazda, hesap yok. |
| 4:45 | Karne | Ortalama, haftalık grafik, en güçlü/zayıf kriter, rozetler. |
| 5:15 | Ayarlar | Tema anında değişir; günlük hatırlatma; verileri temizle (basma, yalnızca göster). |
| 5:45 | README / mimari | İstemci → `/api/judge` (zod doğrulama, dakikada 5 istek sınırı) → OpenAI strict JSON. Anahtar yalnızca sunucuda; API https://prova.expo.app üzerinde canlı. |
| 6:30 | — | Sorular. |

## Bir şey ters giderse

| Sorun | Çözüm |
|---|---|
| Telefon dev sunucusunu bulamıyor (okul ağı) | `npx expo start --tunnel` |
| OpenAI yavaş ya da hata veriyor | Sonuçta "Tekrar dene"; olmazsa `.env`'de `AI_MOCK=1`, sunucuyu yeniden başlat |
| Kamera izni sorunu | Galeriden seç ile devam et |
| İnternet tamamen yok | Çevrimdışı uyarısını göster, sonra dolap ve karne üzerinden anlat |
