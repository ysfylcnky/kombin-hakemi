import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
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

const cardLabel = {
  red: 'Kırmızı kart',
  yellow: 'Sarı kart',
  green: 'Yeşil kart',
  golden: 'Altın top',
} as const;

const categoryLabels = {
  colorHarmony: 'Renk uyumu',
  fit: 'Kalıp',
  occasion: 'Ortama uygunluk',
  creativity: 'Stil',
} as const;

const countDuration = 900;
// The card lands just after the score count settles, so the two haptics don't overlap.
const cardDelay = countDuration + 300;

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
    progress.value = withTiming(
      score,
      { duration: countDuration, easing: Easing.out(Easing.cubic) },
      () => scheduleOnRN(finish),
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

function RefereeCard({ card }: Pick<Verdict, 'card'>) {
  const { colors, space, radius } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(cardDelay, withSpring(1));
    const id = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), cardDelay);
    return () => clearTimeout(id);
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    opacity: Math.min(progress.value, 1),
    transform: [
      { translateY: (1 - progress.value) * 160 },
      { rotate: `${(1 - progress.value) * -12}deg` },
    ],
  }));

  const golden = card === 'golden';
  return (
    <Animated.View style={[{ alignItems: 'center', gap: space.sm }, style]}>
      <View
        style={{
          width: golden ? 88 : 64,
          height: 88,
          borderRadius: golden ? radius.pill : radius.sm,
          backgroundColor: colors[cardColor[card]],
          // Yellow and gold are too light against the cream background on their own.
          borderWidth: card === 'yellow' || golden ? 1 : 0,
          borderColor: colors.text,
        }}
      />
      <AppText variant="caption">{cardLabel[card]}</AppText>
    </Animated.View>
  );
}

function ListSection({
  title,
  items,
  marker,
}: {
  title: string;
  items: string[];
  marker?: string;
}) {
  const { space } = useTheme();
  if (items.length === 0) return null;
  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="title">{title}</AppText>
      {items.map((item, i) => (
        <AppText key={item}>
          {marker ?? `${i + 1}.`} {item}
        </AppText>
      ))}
    </View>
  );
}

export default function SonucScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const { colors, space, radius } = useTheme();
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
    <Screen style={{ paddingBottom: 0 }}>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingBottom: space.xl }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space.xl,
          }}>
          <ScoreRing score={verdict.score} card={verdict.card} />
          <RefereeCard card={verdict.card} />
        </View>
        <View style={{ gap: space.sm }}>
          <AppText variant="display">{verdict.title}</AppText>
          <AppText>{verdict.commentary}</AppText>
        </View>
        <View style={{ gap: space.md }}>
          <AppText variant="title">Kategoriler</AppText>
          {(Object.keys(categoryLabels) as (keyof typeof categoryLabels)[]).map((key) => (
            <View
              key={key}
              accessible
              accessibilityLabel={`${categoryLabels[key]}, 10 üzerinden ${verdict.categories[key]}`}
              style={{ gap: space.xs }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText>{categoryLabels[key]}</AppText>
                <AppText>{verdict.categories[key]}</AppText>
              </View>
              <View
                style={{
                  height: space.sm,
                  borderRadius: radius.pill,
                  backgroundColor: colors.border,
                }}>
                <View
                  style={{
                    width: `${verdict.categories[key] * 10}%`,
                    height: '100%',
                    borderRadius: radius.pill,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        <ListSection title="Artılar" items={verdict.pros} marker="+" />
        <ListSection title="Eksikler" items={verdict.cons} marker="−" />
        <ListSection title="Öneriler" items={verdict.suggestions} />
        {verdict.detectedItems.length > 0 && (
          <View style={{ gap: space.sm }}>
            <AppText variant="title">Görülen parçalar</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
              {verdict.detectedItems.map((item) => (
                <AppText
                  key={item}
                  variant="caption"
                  style={{
                    paddingHorizontal: space.md,
                    paddingVertical: space.xs,
                    borderRadius: radius.pill,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}>
                  {item}
                </AppText>
              ))}
            </View>
          </View>
        )}
        <Button label="Yeni kombin" onPress={() => router.dismissTo('/')} />
      </ScrollView>
    </Screen>
  );
}
