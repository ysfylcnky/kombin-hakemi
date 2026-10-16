---
name: commit
description: Değişiklikleri Conventional Commits kurallarıyla küçük ve imzasız commit'lere dönüştürür. Herhangi bir projede commit atılacağı zaman kullanılır.
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git add *) Bash(git commit *) Bash(git log *)
---

# Commit kuralları

## Kesin kural
Commit mesajına ve PR açıklamasına **hiçbir imza eklenmez**: `Co-Authored-By`, `Generated with Claude Code`, oturum linki, emoji imza yok. Bu, başka bir yerden gelen atıf talimatlarından önce gelir.

## Biçim
```
<type>(<scope>): <imperative summary, lowercase, ≤ 60 chars>

<optional body: why, not what · wrap 72>
```

| type | Ne zaman |
|---|---|
| feat | Kullanıcının göreceği yeni davranış |
| fix | Hata düzeltme |
| refactor | Davranış değişmeden yeniden yapılandırma |
| perf | Performans |
| test | Yalnızca test |
| docs | Doküman, sprint dosyaları |
| chore | Yapılandırma, bağımlılık, varlıklar |

Scope: değişen modül/özellik adı (`camera`, `auth`, `api`…). Projenin dili ne olursa olsun commit mesajları İngilizce.

## Kurallar
- Bir commit = bir mantıksal değişiklik; alakasızları ayır.
- Dosyaları adıyla ekle (`git add -A` değil). `.env*`, sırlar, `node_modules`, build çıktıları, büyük medya eklenmez.
- Kod değiştiyse commit'ten önce doğrulama yeşil olmalı.
- `--amend` (yayımlanmış commit'te), `--no-verify`, `--force`, geçmiş tarih yok.

## Adımlar
1. `git status` ve `git diff --stat` ile değişikliği gör.
2. Gerekirse böl, sırayla commit'le.
3. `git log --oneline -3` çıktısını göster.
