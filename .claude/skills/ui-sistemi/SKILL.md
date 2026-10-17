---
name: ui-sistemi
description: Prova'nın tasarım sistemi - renk/boşluk/tipografi tokenları, temel bileşenler, animasyon, haptik ve erişilebilirlik kuralları. Ekran veya bileşen yazarken, stil değiştirirken kullan.
paths: "app/**/*.tsx, components/**, constants/theme.ts"
---

# Tasarım sistemi

## ui-ux-pro-max ile ilişki
`ui-ux-pro-max` skill'i genel UX kuralları ve React Native rehberi için kullanılır (`--domain ux`, `--stack react-native`). Renk, font ve tasarım dili **bu dosyadan** gelir: `--design-system` önerisi bu tokenlarla çelişirse bu dosya kazanır; `--persist` ile proje dosyası oluşturma.

## Kimlik
Konsept: **editoryal moda dergisi.** Fildişi zemin, mürekkep metin, tek vurgu rengi bordo; koyu temada mürekkep-mor zemin üstünde fildişi metin. Ciddi, sakin ve kendinden emin; futbol, hakem ve oyun çağrışımı yok. Stil minimal: bol boşluk, net hiyerarşi, düz yüzeyler, serif başlıklar. Generic "mor gradyan AI uygulaması" görüntüsünden, 3D ve katmanlı gölgelerden kaçın. Seviye renkleri yalnızca puan halkası ve seviye etiketinde kullanılır.

## Tokenlar (`constants/theme.ts`)
| Token | Açık | Koyu | Kullanım |
|---|---|---|---|
| `bg` | `#F7F3EC` fildişi | `#17131A` | Ekran zemini |
| `surface` | `#FFFDF9` | `#221C25` | Kart |
| `text` | `#1E1A1D` mürekkep | `#F4EEE6` | Ana metin |
| `textMuted` | `#6A615E` | `#ACA39C` | İkincil |
| `primary` | `#7A1F35` bordo | `#D88A9B` | Ana buton, seçili çip |
| `border` | `#E4DCD2` | `#352C35` | Ayraç |
| `levelWeak` | `#A8432A` kiremit | `#E58066` | Zayıf |
| `levelDeveloping` | `#8A6510` hardal | `#DDB04F` | Geliştirilmeli |
| `levelGood` | `#5A6A28` zeytin | `#AFBD6E` | İyi |
| `levelVeryGood` | `#8C2B44` bordo | `#E08EA0` | Çok iyi |
| `levelFlawless` | `#5E1426` koyu bordo | `#F2B8C4` | Kusursuz |

Kontrast: tüm metin ve seviye renkleri iki temada `bg` ve `surface`'e karşı ≥ 4.5:1 (en düşük: açıkta `levelDeveloping` 4.8:1). `primary` üstündeki metin `bg` rengindedir (açık 9.2:1, koyu 7.0:1). `border` dekoratiftir, metin taşımaz.

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
