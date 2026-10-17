---
name: verify
description: Kombin Hakemi'nde tip kontrolü, lint, testler ve Expo bağımlılık sağlığını çalıştırır. Her commit öncesi ve sprint kapanışında kullanılır.
allowed-tools: Bash(npx tsc --noEmit) Bash(npx expo lint) Bash(npx jest *) Bash(npx expo-doctor)
---

# Doğrulama

Sırayla çalıştır, ilk kırmızıda dur ve düzelt:

| # | Kontrol | Komut | Geçme şartı |
|---|---|---|---|
| 1 | Tipler | `npx tsc --noEmit` | 0 hata |
| 2 | Lint | `npx expo lint` | 0 hata (uyarılar raporlanır) |
| 3 | Testler | `npx jest --ci --passWithNoTests` | hepsi yeşil |
| 4 | Expo sağlığı | `npx expo-doctor` | yalnızca sprint kapanışında ve yeni paket eklendiğinde |

Ek kontroller (değişen dosyalarda, komutsuz göz taraması):
- `EXPO_PUBLIC_` önekli bir API anahtarı veya istemci kodunda `OPENAI_API_KEY` geçiyor mu? Varsa **dur**.
- `console.log` kalmış mı?
- `constants/theme.ts` dışında sabit hex renk var mı?

Sonucu tek tabloyla raporla:

| Kontrol | Durum | Not |
|---|---|---|

Bu kontroller cihazda çalışmayı kanıtlamaz. Arayüz değiştiyse raporun sonuna kullanıcının telefonda deneyeceği 1–3 adım ekle.
