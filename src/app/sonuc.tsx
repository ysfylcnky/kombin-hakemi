import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

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

const cardColor = {
  red: 'cardRed',
  yellow: 'cardYellow',
  green: 'cardGreen',
  golden: 'golden',
} as const;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ringSize = 200;
const ringStroke = 12;
const ringRadius = (ringSize - ringStroke) / 2;
const ringLength = 2 * Math.PI * ringRadius;

function ScoreRing({ score, card }: Pick<Verdict, 'score' | 'card'>) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const finish = () =>
      Haptics.notificationAsync(
        card === 'red'
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success,
      );
    // Reanimated jumps straight to the end when the system asks to reduce motion.
    progress.value = withTiming(score, { duration: 900, easing: Easing.out(Easing.cubic) }, () =>
      scheduleOnRN(finish),
    );
  }, [progress, score, card]);

  useAnimatedReaction(
    () => Math.round(progress.value * 2) / 2,
    (value, previous) => {
      if (value !== previous) scheduleOnRN(setShown, value);
    },
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: ringLength * (1 - progress.value / 10),
  }));

  return (
    <View
      accessible
      accessibilityLabel={`Puan 10 üzerinden ${score}`}
      style={{ width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={ringSize}
        height={ringSize}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          stroke={colors.border}
          strokeWidth={ringStroke}
          fill="none"
        />
        <AnimatedCircle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          stroke={colors[cardColor[card]]}
          strokeWidth={ringStroke}
          strokeLinecap="round"
          strokeDasharray={ringLength}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      <AppText variant="score">{shown}</AppText>
    </View>
  );
}

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
    <Screen style={{ justifyContent: 'center', alignItems: 'center', gap: space.lg }}>
      <ScoreRing score={verdict.score} card={verdict.card} />
      <AppText variant="title">{verdict.title}</AppText>
    </Screen>
  );
}
