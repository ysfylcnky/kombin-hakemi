import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { criterionLabels } from '@/lib/ai/schema';
import { listOutfits, type Outfit } from '@/lib/db/outfits';
import { strongestAndWeakest, summarize, weeklyAverages } from '@/lib/stats';

const chartHeight = 160;

function WeekBar({ weekStart, average }: ReturnType<typeof weeklyAverages>[number]) {
  const { colors, space, radius } = useTheme();
  const height = useSharedValue(0);

  useEffect(() => {
    // Reanimated jumps straight to the end when the system asks to reduce motion.
    height.value = withTiming(((average ?? 0) / 10) * chartHeight, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [height, average]);

  const barStyle = useAnimatedStyle(() => ({ height: height.value }));
  const date = new Date(weekStart);

  return (
    <View
      accessible
      accessibilityLabel={`${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} haftası, ${average === null ? 'değerlendirme yok' : `ortalama ${average}`}`}
      style={{ flex: 1, alignItems: 'center', gap: space.xs }}>
      <AppText variant="caption" muted>
        {average ?? '—'}
      </AppText>
      <View style={{ width: '100%', height: chartHeight, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[
            {
              minHeight: space.xs,
              borderRadius: radius.sm,
              backgroundColor: average === null ? colors.border : colors.primary,
            },
            barStyle,
          ]}
        />
      </View>
      <AppText variant="caption" muted>
        {date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
      </AppText>
    </View>
  );
}

export default function KarneScreen() {
  const db = useSQLiteContext();
  const { colors, space, radius } = useTheme();
  const [data, setData] = useState<{ outfits: Outfit[]; now: number }>();
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    // The clock is read here, not during render, so the chart only shifts weeks on reload.
    listOutfits(db).then((outfits) => setData({ outfits, now: Date.now() }), () => setFailed(true));
  }, [db]);
  useFocusEffect(load);

  if (failed) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Karne açılamadı</AppText>
        <AppText muted>Kayıtlı değerlendirmelerin okunamadı.</AppText>
        <Button label="Tekrar dene" onPress={load} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Screen>
    );
  }

  const { outfits, now } = data;
  if (outfits.length === 0) {
    return (
      <Screen style={{ gap: space.lg }}>
        <AppText variant="display">Karne</AppText>
        <AppText muted>Karnen henüz boş. Birkaç değerlendirmeden sonra gelişimin burada görünür.</AppText>
        <Button label="Kombin değerlendir" onPress={() => router.navigate('/')} />
      </Screen>
    );
  }

  const summary = summarize(outfits)!;
  const areas = strongestAndWeakest(outfits)!;
  const tiles = [
    { label: 'Ortalama', value: summary.average },
    { label: 'En iyi', value: summary.best.verdict.score },
    { label: 'En düşük', value: summary.worst.verdict.score },
  ];

  return (
    <Screen style={{ paddingBottom: 0 }}>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingBottom: space.xl }}>
        <AppText variant="display">Karne</AppText>
        <View style={{ flexDirection: 'row', gap: space.md }}>
          {tiles.map(({ label, value }) => (
            <View
              key={label}
              accessible
              accessibilityLabel={`${label} puan ${value}`}
              style={{ flex: 1, gap: space.xs, padding: space.lg, borderRadius: radius.md, backgroundColor: colors.surface }}>
              <AppText variant="caption" muted>
                {label}
              </AppText>
              <AppText variant="title">{value}</AppText>
            </View>
          ))}
        </View>
        <View style={{ gap: space.md }}>
          <AppText variant="title">Son 6 hafta</AppText>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {weeklyAverages(outfits, now).map((week) => (
              <WeekBar key={week.weekStart} {...week} />
            ))}
          </View>
        </View>
        <View style={{ gap: space.sm }}>
          <AppText variant="title">Alanlar</AppText>
          {[
            { label: 'En güçlü', area: areas.strongest },
            { label: 'En zayıf', area: areas.weakest },
          ].map(({ label, area }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText muted>{label}</AppText>
              <AppText>
                {criterionLabels[area.key]} · {area.average}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
