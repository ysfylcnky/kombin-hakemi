import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { type JudgeRequest, occasionLabels } from '@/lib/ai/schema';

export default function OnizlemeScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { colors, space, radius } = useTheme();
  const [occasion, setOccasion] = useState<JudgeRequest['occasion']>('casual');

  if (!uri) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Fotoğraf yok</AppText>
        <AppText muted>Değerlendirme için bir fotoğraf çek ya da galeriden seç.</AppText>
        <Button label="Ana ekrana dön" onPress={() => router.dismissTo('/')} />
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
      <View style={{ gap: space.sm }}>
        <AppText variant="caption" muted>
          Ortam
        </AppText>
        <View
          accessibilityRole="radiogroup"
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {(Object.keys(occasionLabels) as JudgeRequest['occasion'][]).map((key) => {
            const selected = key === occasion;
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityLabel={occasionLabels[key]}
                accessibilityState={{ checked: selected }}
                onPress={() => setOccasion(key)}
                style={{
                  paddingVertical: space.md,
                  paddingHorizontal: space.lg,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary : 'transparent',
                }}>
                <AppText style={{ color: selected ? colors.bg : colors.text }}>
                  {occasionLabels[key]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Button
        label="Değerlendir"
        onPress={() => router.push({ pathname: '/sonuc', params: { uri, occasion } })}
      />
      <Button label="Tekrar çek" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
