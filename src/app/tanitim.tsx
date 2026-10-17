import { router } from 'expo-router';
import Storage from 'expo-sqlite/kv-store';
import { useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';

const pages = [
  {
    title: 'Kombinini boydan çek',
    body: 'Kamerayla çek ya da galeriden seç, ardından nereye giydiğini belirt.',
  },
  {
    title: 'Kriter kriter değerlendirme',
    body: 'Renk uyumu, oran, kalıp ve dahası 10 üzerinden puanlanır. Neyin işlediğini, neyin işlemediğini açıkça söyleriz.',
  },
  {
    title: 'Dolabın ve karnen',
    body: 'Her değerlendirme yalnızca bu cihazda saklanır. Gelişimini karnede izle.',
  },
];

export default function TanitimScreen() {
  const { colors, space, radius } = useTheme();
  const { width } = useWindowDimensions();
  const pageWidth = width - space.xl * 2;
  const scroll = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const last = page === pages.length - 1;

  const finish = () => {
    Storage.setItemSync('onboarded', '1');
    router.replace('/');
  };

  const next = () => {
    scroll.current?.scrollTo({ x: pageWidth * (page + 1) });
    setPage(page + 1);
  };

  return (
    <Screen style={{ gap: space.xl }}>
      <ScrollView
        ref={scroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / pageWidth))}>
        {pages.map(({ title, body }) => (
          <View key={title} style={{ width: pageWidth, justifyContent: 'center', gap: space.lg }}>
            <AppText variant="display">{title}</AppText>
            <AppText muted>{body}</AppText>
          </View>
        ))}
      </ScrollView>
      <View
        accessible
        accessibilityLabel={`Sayfa ${page + 1} / ${pages.length}`}
        style={{ flexDirection: 'row', justifyContent: 'center', gap: space.sm }}>
        {pages.map(({ title }, i) => (
          <View
            key={title}
            style={{
              width: space.sm,
              height: space.sm,
              borderRadius: radius.pill,
              backgroundColor: i === page ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>
      <Button label={last ? 'Başla' : 'İleri'} onPress={last ? finish : next} />
      {!last && <Button label="Geç" variant="ghost" onPress={finish} />}
    </Screen>
  );
}
