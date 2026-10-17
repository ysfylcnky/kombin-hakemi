import { useSQLiteContext } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { useState } from 'react';
import { Alert, Appearance, type ColorSchemeName, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { clearOutfits } from '@/lib/db/outfits';

const themes: { value: ColorSchemeName; label: string }[] = [
  { value: 'unspecified', label: 'Sistem' },
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' },
];

export default function AyarlarScreen() {
  const db = useSQLiteContext();
  const { space } = useTheme();
  const [theme, setTheme] = useState(() => Storage.getItemSync('theme') ?? 'unspecified');

  const chooseTheme = (value: ColorSchemeName) => {
    Appearance.setColorScheme(value);
    Storage.setItemSync('theme', value);
    setTheme(value);
  };

  const confirmClear = () =>
    Alert.alert('Verileri temizle', 'Dolaptaki tüm kombinler ve fotoğrafları kalıcı olarak silinecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () =>
          clearOutfits(db).then(
            () => Alert.alert('Veriler silindi', 'Dolabın ve karnen sıfırlandı.'),
            () => Alert.alert('Veriler silinemedi', 'Bir daha dene.'),
          ),
      },
    ]);

  return (
    <Screen style={{ gap: space.xl }}>
      <AppText variant="display">Ayarlar</AppText>
      <View style={{ gap: space.md }}>
        <AppText variant="title">Görünüm</AppText>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          {themes.map(({ value, label }) => (
            <Chip key={value} label={label} selected={theme === value} onPress={() => chooseTheme(value)} />
          ))}
        </View>
      </View>
      <View style={{ gap: space.md }}>
        <AppText variant="title">Veriler</AppText>
        <AppText muted>Dolabın ve karnen yalnızca bu cihazda saklanır.</AppText>
        <Button label="Verileri temizle" variant="ghost" onPress={confirmClear} />
      </View>
    </Screen>
  );
}
