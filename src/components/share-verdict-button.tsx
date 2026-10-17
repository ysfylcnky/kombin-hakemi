import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import { Alert, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { useTheme } from '@/hooks/use-theme';
import { type JudgeRequest, levelColor, levelLabels, occasionLabels, type Verdict } from '@/lib/ai/schema';

const cardWidth = 360;

type Props = { photoUri: string; verdict: Verdict; occasion: JudgeRequest['occasion'] };

export function ShareVerdictButton({ photoUri, verdict, occasion }: Props) {
  const { colors, space, radius } = useTheme();
  const card = useRef<View>(null);

  const share = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing unavailable');
      const uri = await captureRef(card, { format: 'png' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Stil raporunu paylaş' });
    } catch {
      Alert.alert('Paylaşılamadı', 'Bir daha dene.');
    }
  };

  return (
    <>
      {/* Rendered off screen so the shared image has a fixed layout whatever the device width. */}
      <View
        ref={card}
        collapsable={false}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          left: -10000,
          width: cardWidth,
          gap: space.md,
          padding: space.xl,
          backgroundColor: colors.surface,
        }}>
        <AppText variant="title">Prova</AppText>
        <Image
          source={photoUri}
          contentFit="cover"
          style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <AppText variant="title" style={{ color: colors[levelColor[verdict.level]] }}>
            {levelLabels[verdict.level]}
          </AppText>
          <AppText variant="display">{verdict.score}</AppText>
        </View>
        <AppText variant="caption" muted>
          {occasionLabels[occasion]} kombini · 10 üzerinden
        </AppText>
        <AppText variant="title">{verdict.title}</AppText>
        <AppText>{verdict.commentary}</AppText>
      </View>
      <Button label="Stil raporunu paylaş" variant="ghost" onPress={share} />
    </>
  );
}
