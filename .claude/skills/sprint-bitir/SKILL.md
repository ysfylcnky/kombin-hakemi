---
name: sprint-bitir
description: Aktif sprinti kapatır - doğrulama, kapsam ve kod incelemesi, sprint dosyalarını sıkıştırma, etiket ve GitHub'a push. Kullanıcı /sprint-bitir yazınca çalışır.
argument-hint: "[sprint-no]"
disable-model-invocation: true
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *) Bash(git add *) Bash(git commit *) Bash(git tag *) Bash(git push) Bash(git push -u origin HEAD) Bash(git push origin *) Bash(git remote -v) Bash(git rev-parse *)
---

# /sprint-bitir $ARGUMENTS

## 0. Anlık durum
`docs/sprints/STATE.md`'yi oku; `git status --short` ve `git remote -v` çalıştır.

## ⚑ Son satır kuralı
Bu komutun **son mesajı** tam olarak şunlardan biriyle biter:

| Sonuç | Son satır |
|---|---|
| Kapandı ve push edildi | `✅ S03 bitti ve GitHub'a gönderildi · /clear yapabilirsin, sonra /sprint` |
| Kapandı, push edilemedi | `⚠️ S03 kapandı ama push edilemedi · /clear yapma` |
| Kapanamadı (kırmızı kontrol, eksik görev, cevap bekleniyor) | `⛔ S03 kapanmadı · /clear yapma` |

## 1. Sprint
Argüman varsa normalize et (`3`/`03`/`S03` → S03); yoksa STATE'teki aktif sprint. Aktif sprint yoksa söyle, `⛔` ile bitir.
Yalnızca `STATE.md` ve aktif `S0N.md`'yi oku.

## 2. Kontroller
1. **Doğrulama:** projenin `verify` skill'i ya da tespit ettiğin kontroller. Kırmızıysa düzelt; düzeltemiyorsan dur (`⛔`).
2. **Kapsam:** S0N.md görevlerini commit'lerle eşleştir (`git log --oneline <başlangıç-commit>..HEAD`):

   | Görev | Durum | Commit |
   |---|---|---|

   `[ ]` kalan görev varsa sor: taşınsın mı (STATE → Taşınan işler) yoksa şimdi mi yapılsın.
3. **Kod incelemesi:** yalnızca `git diff --stat <başlangıç-commit>..HEAD` ile gelen dosyalar. Önem sırasıyla: sızan sır/anahtar, gereksiz karmaşıklık (tek kullanımlık soyutlama, kullanılmayan kod/parametre, gereksiz paket — CLAUDE.md sadelik kuralları), doğrulanmamış girdi, eksik yükleme/boş/hata durumu, `any`/zorlama, ölü kod ve `console.log`/`print`. Küçükleri düzelt ve commit'le; büyükleri tabloda raporla.

## 3. Dosyaları sıkıştır (STATE büyümesin)
- **S0N.md:** `Durum: ✅ bitti`; `## Kapanış notu` en fazla 10 satır (biten, kalan, öğrenilen).
- **STATE.md** (`${CLAUDE_SKILL_DIR}/../sprint/references/format.md` iskeletine birebir uy):
  - `Aktif: yok · Sonraki: S0(N+1)`; başlangıç commit'i `-`.
  - Taşınan işler ≤ 5; biten taşınanları sil.
  - Kalıcı kararlar ≤ 10; bu sprintin önemli kararlarını tek satır ekle, taşanı `DECISIONS.md` sonuna taşı.
  - Son sprintler en fazla 2 satır; yenisini başa ekle, 3.'yü sil.
- `docs: close sprint N` ile commit'le, ardından `git tag sprint-NN` (sıfır dolgulu, örn. `sprint-03`).

## 4. Push
1. Remote yoksa push etme; kullanıcıya `gh repo create` veya `git remote add origin …` öner → `⚠️`.
2. `git push`; upstream yoksa `git push -u origin HEAD`. Sonra `git push origin sprint-NN`.
3. Reddedilirse (non-fast-forward vb.) **asla** `--force` kullanma; nedeni yaz → `⚠️`.

## 5. Rapor
| Başlık | İçerik |
|---|---|
| Biten | … |
| Taşınan | … |
| Elle test et | … |
| Demo cümlesi | ROADMAP'teki cümle gerçekleşti mi? |
| Push | ✅ branch + etiket / ⚠️ neden |

Ardından son satır kuralındaki satır.
