import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
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
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useJudgeOutfit } from '@/hooks/use-judge-outfit';
import { useTheme } from '@/hooks/use-theme';
import type { Criteria, JudgeRequest, Level, Verdict } from '@/lib/ai/schema';

const loadingMessages = [
  "Hakem VAR'a gitti…",
  'Renk paleti inceleniyor…',
  'Paça boyu ölçülüyor…',
  'Yan hakemle görüşüyor…',
  'Kart cebinde, karar yakın…',
];

const criterionLabels: Record<keyof Criteria, string> = {
  colorHarmony: 'Renk uyumu',
  proportion: 'Oran ve siluet',
  fit: 'Kalıp ve oturuş',
  formality: 'Formalite tutarlılığı',
  footwearAccessories: 'Ayakkabı ve aksesuar',
  focalPoint: 'Odak noktası ve bütünlük',
  texture: 'Doku ve kumaş',
  pattern: 'Desen kullanımı',
  grooming: 'Bakım ve özen',
};

const levelColor = {
  weak: 'levelWeak',
  developing: 'levelDeveloping',
  good: 'levelGood',
  veryGood: 'levelVeryGood',
  flawless: 'levelFlawless',
} as const;

const levelLabel: Record<Level, string> = {
  weak: 'Zayıf',
  developing: 'Geliştirilmeli',
  good: 'İyi',
  veryGood: 'Çok iyi',
  flawless: 'Kusursuz',
};

const countDuration = 900;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ringSize = 200;
const ringStroke = 12;
const ringRadius = (ringSize - ringStroke) / 2;
const ringLength = 2 * Math.PI * ringRadius;

function ScoreRing({ score, level }: Pick<Verdict, 'score' | 'level'>) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const finish = () =>
      Haptics.notificationAsync(
        level === 'weak'
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success,
      );
    // Reanimated jumps straight to the end when the system asks to reduce motion.
    progress.value = withTiming(
      score,
      { duration: countDuration, easing: Easing.out(Easing.cubic) },
      () => scheduleOnRN(finish),
    );
  }, [progress, score, level]);

  useAnimatedReaction(
    () => Math.round(progress.value * 10) / 10,
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
          stroke={colors[levelColor[level]]}
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
        <AppText key={i}>
          {marker ?? `${i + 1}.`} {item}
        </AppText>
      ))}
    </View>
  );
}

export default function SonucScreen() {
  const { uri, occasion } = useLocalSearchParams<{ uri: string; occasion: JudgeRequest['occasion'] }>();
  const { colors, space, radius } = useTheme();
  const { judge, loading, error } = useJudgeOutfit();
  const [verdict, setVerdict] = useState<Verdict>();
  const [messageIndex, setMessageIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    judge(uri, occasion).then(setVerdict);
    // judge is recreated every render; the request must run once per photo and retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, occasion, attempt]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setMessageIndex((i) => (i + 1) % loadingMessages.length), 1800);
    return () => clearInterval(id);
  }, [loading]);

  if (error) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Düdük çalmadı</AppText>
        <AppText muted>{error}</AppText>
        <Button label="Tekrar dene" onPress={() => setAttempt((a) => a + 1)} />
        <Button label="Geri dön" variant="ghost" onPress={() => router.back()} />
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

  if (!verdict.isOutfit) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Kombin bulunamadı</AppText>
        <AppText muted>{verdict.commentary}</AppText>
        <Button label="Başka fotoğraf seç" onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  return (
    <Screen style={{ paddingBottom: 0 }}>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingBottom: space.xl }}>
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <ScoreRing score={verdict.score} level={verdict.level} />
          <AppText variant="title" style={{ color: colors[levelColor[verdict.level]] }}>
            {levelLabel[verdict.level]}
          </AppText>
        </View>
        <View style={{ gap: space.sm }}>
          <AppText variant="display">{verdict.title}</AppText>
          <AppText>{verdict.commentary}</AppText>
        </View>
        <View style={{ gap: space.lg }}>
          <AppText variant="title">Kriterler</AppText>
          {(Object.keys(criterionLabels) as (keyof Criteria)[]).map((key) => {
            const { score, observation } = verdict.criteria[key];
            return (
              <View
                key={key}
                accessible
                accessibilityLabel={`${criterionLabels[key]}, ${score === null ? 'puanlanmadı' : `10 üzerinden ${score}`}. ${observation}`}
                style={{ gap: space.xs }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText>{criterionLabels[key]}</AppText>
                  <AppText>{score ?? '—'}</AppText>
                </View>
                {score !== null && (
                  <View
                    style={{
                      height: space.sm,
                      borderRadius: radius.pill,
                      backgroundColor: colors.border,
                    }}>
                    <View
                      style={{
                        width: `${score * 10}%`,
                        height: '100%',
                        borderRadius: radius.pill,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                )}
                <AppText variant="caption" muted>
                  {observation}
                </AppText>
              </View>
            );
          })}
        </View>
        <ListSection title="Artılar" items={verdict.pros} marker="+" />
        <ListSection title="Eksikler" items={verdict.cons} marker="−" />
        <ListSection title="Öneriler" items={verdict.suggestions} />
        {verdict.detectedItems.length > 0 && (
          <View style={{ gap: space.sm }}>
            <AppText variant="title">Görülen parçalar</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
              {verdict.detectedItems.map((item, i) => (
                <AppText
                  key={i}
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
