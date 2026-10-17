---
name: ui-sistemi
description: Prova'nın tasarım sistemi - renk/boşluk/tipografi tokenları, temel bileşenler, animasyon, haptik ve erişilebilirlik kuralları. Ekran veya bileşen yazarken, stil değiştirirken kullan.
paths: "app/**/*.tsx, components/**, constants/theme.ts"
---

# Tasarım sistemi

## ui-ux-pro-max ile ilişki
`ui-ux-pro-max` skill'i genel UX kuralları ve React Native rehberi için kullanılır (`--domain ux`, `--stack react-native`). Renk, font ve tasarım dili **bu dosyadan** gelir: `--design-system` önerisi bu tokenlarla çelişirse bu dosya kazanır; `--persist` ile proje dosyası oluşturma.

## Kimlik
Konsept: **sıcak ve butik bir terzi atölyesi.** Kum/bej zemin, koyu kahve metin, tek vurgu rengi camel; koyu temada espresso zemin üstünde kum metin. Ciddi, sakin ve kendinden emin; futbol, hakem ve oyun çağrışımı yok. Pembe, bordo ve soğuk tonlar yok. Stil minimal: bol boşluk, net hiyerarşi, düz yüzeyler, serif başlıklar. Generic "mor gradyan AI uygulaması" görüntüsünden, 3D ve katmanlı gölgelerden kaçın. Seviye renkleri yalnızca puan halkası ve seviye etiketinde kullanılır.

## Tokenlar (`constants/theme.ts`)
| Token | Açık | Koyu | Kullanım |
|---|---|---|---|
| `bg` | `#EFE6D8` kum | `#1C1511` espresso | Ekran zemini |
| `surface` | `#F8F2E8` | `#271E18` | Kart |
| `text` | `#2B1E16` koyu kahve | `#EFE6D8` | Ana metin |
| `textMuted` | `#6B5848` | `#B3A391` | İkincil |
| `primary` | `#8A5A2E` camel | `#C9965F` | Ana buton, seçili çip |
| `border` | `#DCCDB8` | `#3A2E25` | Ayraç |
| `levelWeak` | `#A3422A` kiremit | `#E3826A` | Zayıf |
| `levelDeveloping` | `#7E5B0C` hardal | `#D9AE52` | Geliştirilmeli |
| `levelGood` | `#586620` zeytin | `#B4BE6C` | İyi |
| `levelVeryGood` | `#3F6B3A` yosun | `#8FC27F` | Çok iyi |
| `levelFlawless` | `#2A5440` orman | `#6CCB9C` | Kusursuz |

Kontrast: tüm metin ve seviye renkleri iki temada `bg` ve `surface`'e karşı ≥ 4.5:1 (en düşük: açıkta `primary` 4.7:1). `primary` üstündeki metin `bg` rengindedir (açık 4.7:1, koyu 6.9:1). `border` dekoratiftir, metin taşımaz.

Boşluk ölçeği: `xs 4, sm 8, md 12, lg 16, xl 24, xxl 32`. Köşe: `sm 8, md 14, lg 22, pill 999`.
Fontlar: başlık (`display`, `title`) **Playfair Display**, geri kalan her şey **Inter**; `.ttf` dosyaları `assets/fonts/`, yükleme `expo-font` ile.
Tipografi: `display 32/38 bold`, `title 22/28 semibold`, `body 16/22`, `caption 13/18`, skor için `score 72 heavy, tabular nums`.

## Kurallar
- Sabit hex, sayı veya `fontSize` yok; her şey `useTheme()` üzerinden.
- Ekran kökü `<Screen>` (SafeArea + zemin + padding). Metin `<AppText variant=…>`.
- Dokunma hedefi ≥ 44×44; tüm `Pressable`'larda `accessibilityRole` ve Türkçe `accessibilityLabel`.
- Kontrast ≥ 4.5:1 (büyük metin 3:1). Yazı boyutu ölçeklemesi kapatılmaz.
- Her veri ekranının 3 durumu: `Loading` (iskelet veya kısa durum mesajı), `Empty` (net metin + eylem), `Error` (anlaşılır metin + Tekrar dene).
- Listeler `FlatList`, görseller `expo-image` (`contentFit="cover"`, `transition`).

## Hareket ve his
| Olay | Animasyon | Haptik |
|---|---|---|
| Deklanşör | 120ms beyaz flaş | `impactAsync(Medium)` |
| Puan açılışı | 0'dan puana sayaç, 900ms ease-out | Bitişte `notificationAsync(Success)`; Zayıf seviyede `Error` |
| Favori | Ölçek 1 → 1.2 → 1 | `selectionAsync()` |

Animasyonlar `react-native-reanimated` ile; `useReducedMotion()` true ise animasyon yerine anında son durum.

## Metin tonu
Ciddi, net ve saygılı; bir stil editörünün sesi. Espri, ironi, futbol ve hakem dili yok. Kısa cümle, somut ifade, tek eylem. Örnek boş durum: "Dolabın henüz boş. İlk kombinini değerlendir, burada saklansın."
