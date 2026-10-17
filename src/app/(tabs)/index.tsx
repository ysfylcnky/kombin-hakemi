import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useNetworkState } from 'expo-network';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { levelColor, levelLabels, occasionLabels } from '@/lib/ai/schema';
import { listOutfits, type Outfit } from '@/lib/db/outfits';
import { photoFile } from '@/lib/image';
import { summarize } from '@/lib/stats';

const tips = [
  'Baştan ayağa kadrajda ol; ayakkabılar görünsün.',
  'Gün ışığında, ışığı karşına alarak çek.',
  'Sade bir arka plan seç; aynada flaşı kapat.',
];

export default function ProvaScreen() {
  const db = useSQLiteContext();
  const { colors, space, radius } = useTheme();
  const offline = useNetworkState().isInternetReachable === false;
  const [outfits, setOutfits] = useState<Outfit[]>();

  // A failed read only costs the last-outfit card; the tips and buttons still work.
  useFocusEffect(
    useCallback(() => {
      listOutfits(db).then(setOutfits, () => setOutfits([]));
    }, [db]),
  );

  const pick = async () => {
    try {
      const result = await launchImageLibraryAsync({ mediaTypes: ['images'] });
      if (!result.canceled) router.push({ pathname: '/onizleme', params: { uri: result.assets[0].uri } });
    } catch {
      Alert.alert('Galeri açılamadı', 'Bir daha dene ya da kamerayla çek.');
    }
  };

  const last = outfits?.[0];
  const summary = outfits && summarize(outfits);

  return (
    <Screen style={{ gap: space.lg }}>
      <View>
        <AppText variant="caption" muted>
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </AppText>
        <AppText variant="display">Prova</AppText>
      </View>
      {offline && <AppText accessibilityRole="alert">İnternet bağlantın yok; değerlendirme için bağlan.</AppText>}

      {!outfits ? (
        <View style={{ flex: 1 }} />
      ) : last && summary ? (
        <View style={{ flex: 1, gap: space.md }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Son prova: ${last.verdict.title}, puan ${last.verdict.score}, ${levelLabels[last.verdict.level]}`}
            onPress={() => router.push({ pathname: '/kombin/[id]', params: { id: last.id } })}
            style={({ pressed }) => ({ flex: 1, gap: space.md, opacity: pressed ? 0.7 : 1 })}>
            <Image
              source={photoFile(last.photo).uri}
              contentFit="cover"
              transition={200}
              style={{ flex: 1, borderRadius: radius.lg, backgroundColor: colors.surface }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
              <AppText variant="display">{last.verdict.score}</AppText>
              <View style={{ flex: 1 }}>
                <AppText style={{ color: colors[levelColor[last.verdict.level]] }}>
                  {levelLabels[last.verdict.level]}
                </AppText>
                <AppText variant="caption" muted numberOfLines={1}>
                  {last.verdict.title} · {occasionLabels[last.occasion]} ·{' '}
                  {new Date(last.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                </AppText>
              </View>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${outfits.length} prova, ortalama ${summary.average}. Karneyi aç`}
            onPress={() => router.navigate('/karne')}
            style={{ minHeight: 44, justifyContent: 'center' }}>
            <AppText variant="caption" muted>
              {outfits.length} prova · ortalama {summary.average} ›
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', gap: space.lg }}>
          <AppText muted>Kombinini boydan çek; renk, oran ve kalıp üzerinden değerlendirelim.</AppText>
          {tips.map((tip, i) => (
            <View key={tip} style={{ flexDirection: 'row', gap: space.md }}>
              <AppText variant="title" style={{ color: colors.primary }}>
                {i + 1}
              </AppText>
              <AppText style={{ flex: 1, alignSelf: 'center' }}>{tip}</AppText>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: space.md }}>
        <Button label="Kombinini çek" onPress={() => router.push('/kamera')} />
        <Button label="Galeriden seç" variant="ghost" onPress={pick} />
      </View>
    </Screen>
  );
}
