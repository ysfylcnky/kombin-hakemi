import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';

export default function OnizlemeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { space } = useTheme();

  if (!uri) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Kare boş kaldı</AppText>
        <AppText muted>Hakem boş kareye düdük çalamaz. Bir fotoğraf çek ya da seç.</AppText>
        <Button label="Hakem'e dön" onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  return (
    <Screen style={{ gap: space.lg }}>
      <Image
        source={uri}
        contentFit="contain"
        style={{ flex: 1 }}
        accessibilityLabel="Kombin fotoğrafın"
      />
      <Button
        label="Hakeme gönder"
        onPress={() => router.push({ pathname: '/sonuc', params: { uri } })}
      />
      <Button label="Tekrar çek" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
