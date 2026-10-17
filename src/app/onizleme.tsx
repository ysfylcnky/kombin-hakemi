import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useJudgeOutfit } from '@/hooks/use-judge-outfit';
import { useTheme } from '@/hooks/use-theme';

export default function OnizlemeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { colors, space } = useTheme();
  const { judge, loading, error } = useJudgeOutfit();

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
    // Fixed judge until the Hakem tab gets pickers; the alert stands in for the S04 result screen.
    const verdict = await judge(uri, 'spiker', 'durust');
    if (!verdict) return;
    Alert.alert(
      verdict.isOutfit ? `${verdict.score} · ${verdict.title}` : 'Kombin bulunamadı',
      verdict.commentary,
    );
  };

  return (
    <Screen style={{ gap: space.lg }}>
      <Image
        source={uri}
        contentFit="contain"
        style={{ flex: 1 }}
        accessibilityLabel="Kombin fotoğrafın"
      />
      {error && <AppText muted>{error}</AppText>}
      {loading ? (
        <ActivityIndicator color={colors.primary} accessibilityLabel="Hakem düşünüyor" />
      ) : (
        <Button label="Hakeme gönder" onPress={send} />
      )}
      <Button label="Tekrar çek" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
