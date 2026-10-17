import { requestPermissionsAsync } from 'expo-notifications';
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
import { syncReminders } from '@/lib/reminder';

const themes: { value: ColorSchemeName; label: string }[] = [
  { value: 'unspecified', label: 'Sistem' },
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' },
];

export default function AyarlarScreen() {
  const db = useSQLiteContext();
  const { space } = useTheme();
  const [theme, setTheme] = useState(() => Storage.getItemSync('theme') ?? 'unspecified');
  const [reminder, setReminder] = useState(() => Storage.getItemSync('reminder') === 'on');

  const chooseTheme = (value: ColorSchemeName) => {
    Appearance.setColorScheme(value);
    Storage.setItemSync('theme', value);
    setTheme(value);
  };

  const chooseReminder = async (on: boolean) => {
    if (on && !(await requestPermissionsAsync()).granted) {
      Alert.alert('Bildirim izni yok', "Hatırlatma için telefonunun Ayarlar'ından Prova bildirimlerine izin ver.");
      return;
    }
    Storage.setItemSync('reminder', on ? 'on' : 'off');
    setReminder(on);
    syncReminders(db);
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
        <AppText variant="title">Günlük hatırlatma</AppText>
        <AppText muted>O gün kombin değerlendirmediysen saat 19.00’da hatırlatırız.</AppText>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Chip label="Açık" selected={reminder} onPress={() => chooseReminder(true)} />
          <Chip label="Kapalı" selected={!reminder} onPress={() => chooseReminder(false)} />
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
