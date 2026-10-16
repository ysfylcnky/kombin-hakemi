---
name: sprint
description: Herhangi bir projede bir sprinti başlatır veya kaldığı yerden sürdürür; docs/sprints/ yapısına göre planlar, görev görev uygular ve commit'ler. Kullanıcı /sprint, /sprint 3 veya /sprint 03 yazınca çalışır.
argument-hint: "[sprint-no]"
disable-model-invocation: true
---

# /sprint $ARGUMENTS

## ⚑ Durum satırı (bu oturumdaki HER yanıtın son satırı)
Sprint işi sürdükçe her mesajını, aşağıdakilerden tam olarak biriyle bitir:

| Durum | Son satır |
|---|---|
| Görevler sürüyor | `🟡 S03 devam ediyor (4/7) · /clear yapma` |
| Kullanıcı onayı / cevabı bekleniyor | `⏸️ S03 senin cevabını bekliyor · /clear yapma` |
| Tüm görevler bitti | `🟢 S03 görevleri bitti · /sprint-bitir yaz · /clear yapma` |

`/clear` önerisini **yalnızca** `/sprint-bitir` verir.

## 0. Anlık durum
`docs/sprints/STATE.md`'yi oku; `git status --short` ve `git log --oneline -8` çalıştır. Çalışma ağacı kirliyse (sprint dışı değişiklik) önce kullanıcıya sor.

## 1. Hangi sprint?
- Argümanı normalize et: `3`, `03`, `S03`, `s3` → **S03** (dosya adı `S03.md`).
- Argüman yoksa: STATE'te aktif sprint varsa onu sürdür; yoksa `Sonraki:` sprintini başlat.
- STATE'te **başka** bir sprint aktifse ve bitmemişse: durup sor (onu sürdür / önce `/sprint-bitir`).

## 2. Proje bu yapıyı kullanmıyorsa (ilk kurulum)
`docs/sprints/STATE.md` yoksa:
1. Mevcut plan/ilerleme dokümanlarını ara (`PLAN*`, `PROGRESS*`, `ROADMAP*`, `TODO*`, `docs/**`). Bunları **tamamen okuma**, önce başlıkları Grep'le.
2. `${CLAUDE_SKILL_DIR}/references/format.md` formatına göre dönüşüm planını tabloyla göster: hangi içerik nereye gidecek, eski dosyalar silinecek mi.
3. Onay gelince dönüştür, `docs: migrate to sprint docs structure` ile commit'le, sonra 3. adımdan devam et.

## 3. Okuma bütçesi
- Oku: `STATE.md`, `docs/sprints/S0N.md`.
- Yeni sprint başlıyorsa ek olarak `ROADMAP.md`.
- **Okuma:** biten sprint dosyaları, `DECISIONS.md`, büyük ürün/plan dokümanları. Belirli bir bilgi gerekirse önce Grep, sonra yalnızca o aralığı oku.

## 4. Sprint başlıyorsa (S0N.md durumu `⏳ planlandı`)
1. Plan moduna geç. Taşınan işleri ve S0N görevlerini şu tabloyla planla:

   | Görev | Dosyalar | Yeni paket | Test | Commit mesajı |
   |---|---|---|---|---|

   Bir görev tek commit'e sığmıyorsa böl; değişikliği S0N.md'ye yansıt.
   Her görev için **en basit çalışan çözümü** seç; CLAUDE.md'deki "Sadelik kuralları"na aykırı paket, dosya veya soyutlama planlama.
2. Kullanıcı onaylayınca: S0N.md `Durum: 🔄 devam`; STATE'te `Aktif: S0N (devam, 0/y)` ve `Aktif sprint başlangıç commit'i: <git rev-parse --short HEAD>`. `docs: start sprint N` ile commit'le.

## 5. Uygulama döngüsü (her görev)
1. Uygula, yalnızca görevin istediği kadar. Commit'ten önce diff'i "bu satır silinse görev yine çalışır mı?" sorusuyla tara ve gereksizi sil. Projede ilgili skill varsa (arayüz, AI, veri…) ona uy; framework API'sinden emin değilsen tahmin etme, dokümana bak.
2. Saf mantık için test yaz veya güncelle.
3. Doğrula: projede `verify` skill'i varsa onu çalıştır; yoksa `package.json` script'lerinden (typecheck/lint/test) veya `pyproject`/`Makefile`'dan uygun kontrolleri bul. Kırmızıyken commit yok.
4. S0N.md'de görevi `[x]` yap, STATE'teki `x/y`'yi güncelle; kod + bu iki dosyayı **tek commit**'te `commit` skill'ine göre commit'le.
5. Kullanıcıya en fazla 3 satır: ne bitti · elle denemesi gereken şey (varsa) · durum satırı.

Kullanıcı durdurmadıkça sıradaki göreve geç. Belirsiz karar (kapsam, tasarım, paket seçimi, geri alınamaz işlem) varsa sor ve `⏸️` durum satırını kullan.

## 6. Görevler bitince
STATE'te `Aktif: S0N (görevler bitti, kapanış bekliyor)` yap, commit'le. Kapanışı kendin başlatma; `🟢` satırıyla `/sprint-bitir` iste.
