---
name: ui-sistemi
description: Kombin Hakemi'nin tasarım sistemi - renk/boşluk/tipografi tokenları, temel bileşenler, animasyon, haptik ve erişilebilirlik kuralları. Ekran veya bileşen yazarken, stil değiştirirken kullan.
paths: "app/**/*.tsx, components/**, constants/theme.ts"
---

# Tasarım sistemi

## ui-ux-pro-max ile ilişki
`ui-ux-pro-max` skill'i genel UX kuralları ve React Native rehberi için kullanılır (`--domain ux`, `--stack react-native`). Renk, font ve tasarım dili **bu dosyadan** gelir: `--design-system` önerisi bu tokenlarla çelişirse bu dosya kazanır; `--persist` ile proje dosyası oluşturma.

## Kimlik
Konsept: **futbol hakemi × moda podyumu.** Koyu saha yeşili zemin üstünde krem metin, vurgu olarak hakem kartı renkleri. Ciddi görünümlü ama metinler ironik. Generic "mor gradyan AI uygulaması" görüntüsünden kaçın.

## Tokenlar (`constants/theme.ts`)
| Token | Açık | Koyu | Kullanım |
|---|---|---|---|
| `bg` | `#F6F3EA` | `#0F1A14` | Ekran zemini |
| `surface` | `#FFFFFF` | `#18261E` | Kart |
| `text` | `#14201A` | `#F3EEDF` | Ana metin |
| `textMuted` | `#5B6B62` | `#A7B3AA` | İkincil |
| `primary` | `#1F7A4D` | `#3DBE7E` | Ana buton |
| `cardRed` | `#D7263D` | `#FF4D5E` | Kırmızı kart |
| `cardYellow` | `#F2B705` | `#FFD23F` | Sarı kart |
| `cardGreen` | `#2E9E5B` | `#4CD683` | Yeşil kart |
| `golden` | `#C9A227` | `#E6C25A` | Altın top |
| `border` | `#E2DDD0` | `#26372D` | Ayraç |

Boşluk ölçeği: `xs 4, sm 8, md 12, lg 16, xl 24, xxl 32`. Köşe: `sm 8, md 14, lg 22, pill 999`.
Tipografi: `display 32/38 bold`, `title 22/28 semibold`, `body 16/22`, `caption 13/18`, skor için `score 72 heavy, tabular nums`.

## Kurallar
- Sabit hex, sayı veya `fontSize` yok; her şey `useTheme()` üzerinden.
- Ekran kökü `<Screen>` (SafeArea + zemin + padding). Metin `<AppText variant=…>`.
- Dokunma hedefi ≥ 44×44; tüm `Pressable`'larda `accessibilityRole` ve Türkçe `accessibilityLabel`.
- Kontrast ≥ 4.5:1 (büyük metin 3:1). Yazı boyutu ölçeklemesi kapatılmaz.
- Her veri ekranının 3 durumu: `Loading` (iskelet veya eğlenceli mesaj), `Empty` (ironik metin + eylem), `Error` (anlaşılır metin + Tekrar dene).
- Listeler `FlatList`, görseller `expo-image` (`contentFit="cover"`, `transition`).

## Hareket ve his
| Olay | Animasyon | Haptik |
|---|---|---|
| Deklanşör | 120ms beyaz flaş | `impactAsync(Medium)` |
| Puan açılışı | 0'dan puana sayaç, 900ms ease-out | Bitişte `notificationAsync(Success)`; kırmızıda `Error` |
| Kart çıkışı | Aşağıdan yukarı + hafif dönme (spring) | `impactAsync(Heavy)` |
| Favori | Ölçek 1 → 1.2 → 1 | `selectionAsync()` |

Animasyonlar `react-native-reanimated` ile; `useReducedMotion()` true ise animasyon yerine anında son durum.

## Metin tonu
Kısa, esprili, kimseyi kırmayan. Örnek boş durum: "Dolabın bomboş. Hakem bekliyor, sen nerdesin?"
