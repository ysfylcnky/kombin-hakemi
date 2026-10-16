---
name: sadelestir
description: Mevcut kodu davranışını değiştirmeden sadeleştirir - gereksiz soyutlama, kullanılmayan kod, fazla dosya ve paketleri bulup onayla kaldırır. Kullanıcı /sadelestir [klasör veya dosya] yazınca çalışır.
argument-hint: "[yol | sprint | tumu]"
disable-model-invocation: true
---

# /sadelestir $ARGUMENTS

Amaç: **aynı davranış, daha az kod.** Yeni özellik eklenmez, davranış değişmez.

## 1. Kapsam
| Argüman | Taranan |
|---|---|
| boş veya `sprint` | Aktif/son sprintte değişen dosyalar (`docs/sprints/STATE.md` başlangıç commit'inden `HEAD`'e, yoksa son 20 commit) |
| bir yol | O klasör/dosya |
| `tumu` | Tüm kaynak kod (önce dosya listesini ve boyutlarını göster, onay al) |

## 2. Ara
| Belirti | Örnek |
|---|---|
| Tek kullanımlık soyutlama | Bir yerde kullanılan helper, hook, wrapper, factory, base class |
| Kullanılmayan kod | Export edilip import edilmeyen fonksiyon, ölü dal, kullanılmayan parametre/prop/tip |
| Spekülatif genellik | "İleride lazım olur" ayarları, generic tipler, strateji/plug-in yapıları |
| Gereksiz savunma | İç fonksiyonlarda imkânsız durum kontrolleri, yutulan try/catch |
| Fazla katman | Sadece başka fonksiyonu çağıran fonksiyon, yeniden export dosyaları |
| Gereksiz paket | Platformun/standart kütüphanenin zaten yaptığı iş için bağımlılık |
| Gürültü | Kodu tekrar eden yorumlar, `console.log`/`print`, yorum satırına alınmış kod |
| Dosya şişkinliği | Tek satırlık tip/sabit dosyaları, tek dosyalık klasörler |

## 3. Öner (kod değiştirmeden)
| # | Dosya | Sorun | Öneri | Tahmini −satır | Risk |
|---|---|---|---|---|---|

Risk: `düşük` (davranışa dokunmaz) / `orta` (çağıranlar değişir) / `yüksek` (dış davranışı etkileyebilir). Yüksek riskleri ayrı listele; varsayılan olarak önermeyiz.
Kullanıcı hangi maddeleri onayladığını söyleyene kadar bekle.

## 4. Uygula
- Onaylanan maddeleri küçük gruplar hâlinde uygula.
- Her gruptan sonra projenin doğrulamasını çalıştır (`verify` skill'i ya da package.json/pyproject kontrolleri). Kırmızıysa geri al ve maddeyi "uygulanamadı" diye işaretle.
- Her grup ayrı commit: `refactor(<scope>): simplify …` (imzasız, `commit` skill'i).
- Dış davranış, API sözleşmesi, veritabanı şeması, kullanıcıya görünen metin değişmez.

## 5. Rapor
| Uygulanan | Atlanan | Silinen satır (`git diff --shortstat`) | Kaldırılan paket |
|---|---|---|---|

Kullanıcıya elle denemesi gereken akışları en fazla 3 madde olarak yaz.
