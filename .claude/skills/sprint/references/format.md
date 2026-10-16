# Sprint dosya formatı

Tüm projelerde aynı yapı. Amaç: her oturumda okunan bağlam sabit ve küçük kalsın.

```
docs/sprints/
  ROADMAP.md    # her zaman okunur · tek tablo · ≤ 30 satır
  STATE.md      # her zaman okunur · ≤ 40 satır, büyümez
  S01.md …      # yalnızca aktif olan okunur; bitenler arşivdir
  DECISIONS.md  # isteğe bağlı · yalnızca gerektiğinde grep'lenir
```

## ROADMAP.md
```markdown
# Yol haritası

| Sprint | Hafta | Tema | Demo cümlesi |
|---|---|---|---|
| S01 | … | … | "…" |
```

## STATE.md (bu iskelet dışında bölüm eklenmez)
```markdown
# Sprint durumu

Aktif: S03 (devam, 4/7) · Sonraki: S04 · Son güncelleme: YYYY-MM-DD
Aktif sprint başlangıç commit'i: <kısa sha>

## Taşınan işler
- (önceki sprintten devreden, en fazla 5; sprint içinde biten silinir)

## Kalıcı kararlar
- (projeyi etkileyen tek satırlık kararlar, en fazla 10;
   11. eklenince en eskisi DECISIONS.md'nin sonuna taşınır)

## Son sprintler
- S02: tek satır özet · etiket sprint-02
- S01: tek satır özet · etiket sprint-01
  (en fazla 2 satır; daha eskisi silinir, ayrıntısı zaten S0N.md'de)
```
`Aktif:` alanı değerleri: `yok`, `S03 (planlanıyor)`, `S03 (devam, x/y)`, `S03 (görevler bitti, kapanış bekliyor)`.

## S0N.md
```markdown
# S03 · <tema>

Hafta: … · Durum: ⏳ planlandı | 🔄 devam | ✅ bitti

## Hedef
<1-2 cümle>

## Görevler
- [ ] 3.1 <görev> — `<commit mesajı>`
- [x] 3.2 …

## Bitti sayılır
<kabul kriterleri>

## Kapanış notu
<sprint-bitir doldurur, ≤ 10 satır: ne bitti, ne kaldı, öğrenilen>
```

## Okuma bütçesi
| Dosya | Ne zaman okunur |
|---|---|
| STATE.md, aktif S0N.md | Her `/sprint` ve `/sprint-bitir` |
| ROADMAP.md | Yalnızca yeni sprint başlarken |
| Biten S0N.md'ler, DECISIONS.md, PRODUCT/PLAN gibi büyük dokümanlar | Yalnızca belirli bir bilgi gerektiğinde, önce Grep ile ilgili satır bulunur |
