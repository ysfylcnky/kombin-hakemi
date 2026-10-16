# Kombin Hakemi

Kombininin fotoğrafını çek, AI hakem puanını versin, kartını göstersin ve ironik yorumunu yapsın.
Mobile Application Development dersi final projesi (Expo + React Native).

## Kurulum

```bash
npm install
cp .env.example .env   # ANTHROPIC_API_KEY'i doldur ya da AI_MOCK=1 bırak
npx expo start
```

Telefonda Expo Go ile QR kodu okut (iPhone ve Android).

## Komutlar

| İş | Komut |
|---|---|
| Geliştirme sunucusu | `npx expo start` |
| Tip kontrolü | `npx tsc --noEmit` |
| Lint | `npx expo lint` |
| Test | `npx jest` |

## Klasör yapısı

| Klasör | İçerik |
|---|---|
| `src/app/` | Ekranlar (expo-router) |
| `src/components/` | Yeniden kullanılan arayüz parçaları |
| `src/constants/theme.ts` | Renk, boşluk ve yazı tokenları |
| `src/hooks/` | `useTheme` |
| `assets/fonts/` | Inter ve Playfair Display |
| `docs/` | Ürün tasarımı ve sprint planı |

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `ANTHROPIC_API_KEY` | Yalnızca sunucuda okunur; istemciye asla gitmez |
| `AI_MOCK` | `1` iken Claude çağrılmaz, sahte karar döner |
