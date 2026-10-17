import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { prepareImage } from '@/lib/image';

export default function OnizlemeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { colors, space } = useTheme();
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!uri) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Kare boş kaldı</AppText>
        <AppText muted>Hakem boş kareye düdük çalamaz. Bir fotoğraf çek ya da seç.</AppText>
        <Button label="Hakem'e dön" onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  const send = async () => {
    setSending(true);
    setFailed(false);
    try {
      const image = await prepareImage(uri);
      // Base64 is 4 chars per 3 bytes, so this is the actual JPEG size.
      const kb = Math.round((image.base64.length * 3) / 4 / 1024);
      Alert.alert('Fotoğraf hazır', `${kb} KB · Hakem bir sonraki sprintte bağlanacak.`);
    } catch {
      setFailed(true);
    }
    setSending(false);
  };

  return (
    <Screen style={{ gap: space.lg }}>
      <Image
        source={uri}
        contentFit="contain"
        style={{ flex: 1 }}
        accessibilityLabel="Kombin fotoğrafın"
      />
      {failed && <AppText muted>Fotoğraf hazırlanamadı. Bir daha dene.</AppText>}
      {sending ? (
        <ActivityIndicator color={colors.primary} accessibilityLabel="Hazırlanıyor" />
      ) : (
        <Button label="Hakeme gönder" onPress={send} />
      )}
      <Button label="Tekrar çek" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
