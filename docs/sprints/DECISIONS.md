# Kararlar arşivi

- Kod `src/` altında: ekranlar `src/app`, `@/*` → `src/*`; PRODUCT'taki `app/...` yolları buna göre okunur.
- Stil yalnızca `useTheme()` (`colors`, `space`, `radius`, `typography`); font ağırlığı `fontFamily` ile; palet kum / koyu kahve / camel, pembe-bordo yok.
- Hedef yalnızca iPhone + Android (Expo Go); web'e özel kod yazılmaz.
- Kamera üstü katman temadan bağımsız `colors.dark` kullanır (önizleme hep koyu).
