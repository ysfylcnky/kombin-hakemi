# Kombin Hakemi

Kombin fotoğrafını AI hakeme gönderen, puan + kart + ironik yorum veren Expo uygulaması.
Mobile Application Development final projesi. `AGENTS.md` Expo'nun kendi dosyasıdır, silinmez.

## Sadelik kuralları (her işte geçerli, diğer tüm kurallardan önce gelir)
1. Yalnızca istenen görevi yap. "İleride lazım olur" kodu, ayarı, parametresi yok.
2. Önce en kısa çalışan çözümü yaz. Aynı işi daha az satırla yapan bir yol varsa onu kullan.
3. Soyutlama (helper, hook, wrapper, bileşen) ancak aynı kod **üçüncü** kez tekrar ederse.
4. Yeni dosya veya klasörü ancak gerçekten gerekiyorsa aç. Tek kullanımlık tip/sabit dosyası yok.
5. Yeni paket eklemeden önce: Expo, React Native veya JavaScript bunu zaten yapıyor mu? Yapıyorsa paket yok. Gerekiyorsa tek cümle gerekçe yaz ve sor.
6. Hata kontrolü ve doğrulama yalnızca sistem sınırında: kullanıcı girdisi, ağ, dosya, AI yanıtı. İç fonksiyonlarda imkânsız durum kontrolü yok.
7. Yorum yalnızca "neden"i açıklıyorsa yazılır. Kodu tekrar eden yorum, JSDoc, bölüm başlığı yok.
8. İstenmeyen dosyaya dokunma; "bu arada" refactor yok.
9. Testi yalnızca mantık içeren saf fonksiyonlara yaz. Basit bileşenlere test yok.
10. Teslimden önce diff'teki her satıra sor: "Bu silinse görev yine çalışır mı?" Çalışıyorsa sil.

Mevcut koddaki fazlalıklar için kullanıcı `/sadelestir` çalıştırır.

## Dokümanlar (otomatik yüklenmez, gerektiğinde oku)
| Dosya | İçerik |
|---|---|
| `docs/sprints/STATE.md` | Aktif sprint ve kısa durum |
| `docs/sprints/S0N.md` | Sprint görevleri ve kapanış notu |
| `docs/sprints/ROADMAP.md` | 8 sprintlik tablo |
| `docs/PRODUCT.md` | Ürün, teknik yığın, mimari, ekranlar; önce Grep ile ilgili bölümü bul |

## Çalışma şekli
- İş sprint sprint yürür: `/sprint` başlatır veya sürdürür, `/sprint-bitir` kapatır ve GitHub'a gönderir.
- Plan dışı özellik ekleme; fikir varsa kullanıcıya öner.
- Commit mesajlarına ve PR'lara **Co-Authored-By, "Generated with Claude" veya benzeri hiçbir imza ekleme.**

## Teknik kurallar
- TypeScript strict; `any` yok. Import'larda `@/` alias'ı.
- Yönlendirme yalnızca expo-router. Ekranlar `app/`, yeniden kullanılan UI `components/`, mantık `lib/`.
- Expo paketleri `npx expo install <paket>` ile eklenir ki SDK ile uyumlu sürüm gelsin.
- Expo Go'da çalışmayan native paket ekleme.
- Arayüz işinde `ui-sistemi` (proje renkleri, tokenlar) ve `ui-ux-pro-max` (genel UX ve React Native kuralları) skill'leri kullanılır. Çelişkide `ui-sistemi` kazanır.
- AI ile ilgili her iş `ai-hakem` skill'ine uyar. API anahtarı yalnızca sunucuda; `EXPO_PUBLIC_` önekli anahtar asla yok.
- Kullanıcıya görünen metinler Türkçe; kod, değişken ve commit mesajları İngilizce.
- Her ekranda yükleme, boş ve hata durumu düşünülür.

## Komutlar
| İş | Komut |
|---|---|
| Geliştirme sunucusu | `npx expo start` |
| Tip kontrolü | `npx tsc --noEmit` |
| Lint | `npx expo lint` |
| Test | `npx jest --passWithNoTests` |
| Bağımlılık sağlığı | `npx expo-doctor` |

## Test cihazları
iPhone ve Android, Expo Go. Claude cihazda deneyemez; bir görevi bitirince kullanıcıya "telefonda şunu dene" diye kısa liste verir.
