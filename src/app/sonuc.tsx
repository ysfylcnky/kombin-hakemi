import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { useJudgeOutfit } from '@/hooks/use-judge-outfit';
import { useTheme } from '@/hooks/use-theme';
import type { Verdict } from '@/lib/ai/schema';

const loadingMessages = [
  "Hakem VAR'a gitti…",
  'Renk paleti inceleniyor…',
  'Paça boyu ölçülüyor…',
  'Yan hakemle görüşüyor…',
  'Kart cebinde, karar yakın…',
];

export default function SonucScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { colors, space } = useTheme();
  const { judge, loading, error } = useJudgeOutfit();
  const [verdict, setVerdict] = useState<Verdict>();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    judge(uri).then(setVerdict);
    // judge is recreated every render; the request must run once per photo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setMessageIndex((i) => (i + 1) % loadingMessages.length), 1800);
    return () => clearInterval(id);
  }, [loading]);

  if (error) {
    return (
      <Screen style={{ justifyContent: 'center' }}>
        <AppText>{error}</AppText>
      </Screen>
    );
  }

  if (!verdict) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center', gap: space.lg }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <AppText variant="title" accessibilityLiveRegion="polite">
          {loadingMessages[messageIndex]}
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen style={{ justifyContent: 'center', gap: space.lg }}>
      <AppText variant="score">{verdict.score}</AppText>
      <AppText variant="title">{verdict.title}</AppText>
    </Screen>
  );
}
