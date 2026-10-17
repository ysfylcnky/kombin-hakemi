import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';
import { type Level, levelLabels } from '@/lib/ai/schema';
import { filterOutfits, listOutfits, type Outfit, type OutfitFilter } from '@/lib/db/outfits';
import { photoFile } from '@/lib/image';

const noFilter: OutfitFilter = { favorites: false, level: null, sort: 'date' };

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors, space, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        paddingVertical: space.md,
        paddingHorizontal: space.lg,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : 'transparent',
      }}>
      <AppText style={{ color: selected ? colors.bg : colors.text }}>{label}</AppText>
    </Pressable>
  );
}

export default function DolapScreen() {
  const db = useSQLiteContext();
  const { colors, space, radius } = useTheme();
  const { width } = useWindowDimensions();
  const [outfits, setOutfits] = useState<Outfit[]>();
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState(noFilter);

  const load = useCallback(() => {
    setFailed(false);
    listOutfits(db).then(setOutfits, () => setFailed(true));
  }, [db]);
  useFocusEffect(load);

  if (failed) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Dolap açılamadı</AppText>
        <AppText muted>Kayıtlı kombinlerin okunamadı.</AppText>
        <Button label="Tekrar dene" onPress={load} />
      </Screen>
    );
  }

  if (!outfits) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Screen>
    );
  }

  const shown = filterOutfits(outfits, filter);
  const itemWidth = (width - space.xl * 2 - space.md) / 2;

  return (
    <Screen style={{ paddingBottom: 0 }}>
      <FlatList
        data={shown}
        keyExtractor={(o) => String(o.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md }}
        contentContainerStyle={{ gap: space.md, paddingBottom: space.xl }}
        ListHeaderComponent={
          <View style={{ gap: space.lg, paddingBottom: space.sm }}>
            <AppText variant="display">Dolap</AppText>
            {outfits.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                <Chip
                  label="Puana göre"
                  selected={filter.sort === 'score'}
                  onPress={() => setFilter({ ...filter, sort: filter.sort === 'score' ? 'date' : 'score' })}
                />
                <Chip
                  label="Favoriler"
                  selected={filter.favorites}
                  onPress={() => setFilter({ ...filter, favorites: !filter.favorites })}
                />
                {(Object.keys(levelLabels) as Level[]).map((level) => (
                  <Chip
                    key={level}
                    label={levelLabels[level]}
                    selected={filter.level === level}
                    onPress={() => setFilter({ ...filter, level: filter.level === level ? null : level })}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        }
        ListEmptyComponent={
          outfits.length === 0 ? (
            <View style={{ gap: space.lg }}>
              <AppText muted>Dolabın henüz boş. İlk kombinini değerlendir, burada saklansın.</AppText>
              <Button label="Kombin değerlendir" onPress={() => router.navigate('/')} />
            </View>
          ) : (
            <View style={{ gap: space.lg }}>
              <AppText muted>Bu filtreye uyan kombin yok.</AppText>
              <Button label="Filtreleri temizle" variant="ghost" onPress={() => setFilter(noFilter)} />
            </View>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.verdict.title}, puan ${item.verdict.score}, ${levelLabels[item.verdict.level]}`}
            onPress={() => router.push({ pathname: '/kombin/[id]', params: { id: item.id } })}
            style={({ pressed }) => ({ width: itemWidth, opacity: pressed ? 0.7 : 1 })}>
            <Image
              source={photoFile(item.photo).uri}
              contentFit="cover"
              transition={200}
              style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md }}
            />
            <AppText
              variant="caption"
              style={{
                position: 'absolute',
                left: space.sm,
                bottom: space.sm,
                paddingHorizontal: space.sm,
                paddingVertical: space.xs,
                borderRadius: radius.pill,
                backgroundColor: colors.surface,
                overflow: 'hidden',
              }}>
              {item.verdict.score}
            </AppText>
          </Pressable>
        )}
      />
    </Screen>
  );
}
