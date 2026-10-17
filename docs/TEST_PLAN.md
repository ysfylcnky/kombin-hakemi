# Manuel test planı

iPhone ve Android'de Expo Go ile koşulur; `.env`'de gerçek `OPENAI_API_KEY` olsun, `AI_MOCK` kapalı (Expo Go istekleri bilgisayardaki `npx expo start` sunucusuna gider). Her satırı iki cihazda dene; geçerse `x`, kalırsa `!` yaz ve aşağıdaki **Bulgular**'a ekle.
Her ekranda açık ve koyu temaya bir kez bak.

## Hazırlık
- Uygulamayı Expo Go'dan sil, yeniden aç (temiz ilk açılış).
- Telefonda iki fotoğraf hazır olsun: tam boy bir kombin ve kombin olmayan bir şey (masa, manzara).

## Akış

| # | Adım | Beklenen | iPhone | Android |
|---|---|---|---|---|
| 1 | İlk açılış | Tanıtım açılır; İleri ile sayfalar ilerler, son sayfada Başla | [x] | [x] |
| 2 | Uygulamayı kapat, aç | Tanıtım bir daha gelmez | [x] | [x] |
| 3 | Ana sayfa, dolap boş | Son prova kartı yok, çekim ipuçları görünür, butonlar altta | [x] | [x] |
| 4 | Kombinini çek → izin ver | Kamera açılır; reddedilirse "Ayarlar'ı aç" çıkar | [x] | [x] |
| 5 | Çevir, 3-2-1 açık çekim | Ön/arka kamera değişir; geri sayım sonrası çeker, sayım sırasında dokunmak iptal eder | [x] | [x] |
| 6 | Önizleme | Fotoğraf görünür; ortam seçilebilir (Günlük, İş, Davet, Spor); Tekrar çek kameraya döner | [x] | [x] |
| 7 | Değerlendir | Yükleme mesajları döner; puan halkası dolar, seviye, kriterler, Artılar/Eksikler/Öneriler gelir | [x] | [x] |
| 8 | Raporu paylaş | Paylaşım sayfası açılır, görsel rapor düzgün | [x] | [x] |
| 9 | Yeni kombin | Ana sayfaya döner, son prova kartı az önceki kombin | [x] | [x] |
| 10 | Galeriden seç → kombin olmayan foto | "Kombin bulunamadı" ve Başka fotoğraf seç; dolaba kaydedilmez | [x] | [x] |
| 11 | Uçak modu, ana sayfa ve önizleme | "İnternet bağlantın yok" uyarısı, Değerlendir yerine uyarı | [x] | [x] |
| 12 | Değerlendir'e basıp hemen uçak modu | Hata ekranı; bağlantı gelince Tekrar dene çalışır | [x] | [x] |
| 13 | Dolap | Kombinler ızgarada; Puana göre, Favoriler, seviye filtreleri çalışır; boş sonuçta Filtreleri temizle | [x] | [x] |
| 14 | Kombin detayı | Fotoğraf ve rapor; paylaş çalışır; Favorilere ekle/çıkar; Kombini sil onay ister ve dolaptan düşer | [x] | [x] |
| 15 | Karne | Ortalama, haftalık grafik, kriter puanları, rozetler (İlk Prova kazanılmış) | [x] | [x] |
| 16 | Ayarlar → tema | Sistem, Açık, Koyu anında uygulanır; uygulama yeniden açılınca korunur | [x] | [x] |
| 17 | Ayarlar → hatırlatma Açık | İzin ister; reddedilirse uyarı çıkar, Kapalı seçili kalır | [x] | [x] |
| 18 | Ayarlar → Verileri temizle | Onay sonrası dolap ve karne boş durumuna döner | [x] | [x] |
| 19 | VoiceOver / TalkBack ile ana sayfa ve sonuç | Butonlar ve puan anlamlı okunur | [x] | [x] |
| 20 | Yazı boyutunu en büyüğe al | Metin taşmaz, butonlar erişilebilir kalır | [x] | [x] |

## Bulgular

| # | Cihaz | Ne oldu | Önem |
|---|---|---|---|
| | | | |
