import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ShareVerdictButton } from '@/components/share-verdict-button';
import { useTheme } from '@/hooks/use-theme';
import {
  type Criteria,
  criterionLabels,
  levelColor,
  levelLabels,
  occasionLabels,
} from '@/lib/ai/schema';
import { deleteOutfit, getOutfit, type Outfit, setFavorite } from '@/lib/db/outfits';
import { photoFile } from '@/lib/image';

export default function KombinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const { colors, space, radius } = useTheme();
  const [outfit, setOutfit] = useState<Outfit | null>();

  useEffect(() => {
    getOutfit(db, Number(id)).then(setOutfit, () => setOutfit(null));
  }, [db, id]);

  if (outfit === undefined) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Screen>
    );
  }

  if (outfit === null) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="title">Kombin bulunamadı</AppText>
        <AppText muted>Bu kayıt silinmiş ya da okunamadı.</AppText>
        <Button label="Dolaba dön" onPress={() => router.back()} />
      </Screen>
    );
  }

  const { verdict } = outfit;

  const toggleFavorite = () => {
    const favorite = !outfit.favorite;
    setFavorite(db, outfit.id, favorite).then(
      () => {
        Haptics.selectionAsync();
        setOutfit({ ...outfit, favorite });
      },
      () => Alert.alert('Favori güncellenemedi', 'Bir daha dene.'),
    );
  };

  const confirmDelete = () =>
    Alert.alert('Kombini sil', 'Bu kombin ve fotoğrafı kalıcı olarak silinecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () =>
          deleteOutfit(db, outfit).then(
            () => router.back(),
            () => Alert.alert('Kombin silinemedi', 'Bir daha dene.'),
          ),
      },
    ]);

  return (
    <Screen style={{ paddingBottom: 0 }}>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingBottom: space.xl }}>
        <Image
          source={photoFile(outfit.photo).uri}
          contentFit="cover"
          style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md }}
          accessible
          accessibilityLabel="Kombin fotoğrafı"
        />
        <View style={{ gap: space.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <AppText variant="title" style={{ color: colors[levelColor[verdict.level]] }}>
              {levelLabels[verdict.level]}
            </AppText>
            <AppText variant="title">{verdict.score}</AppText>
          </View>
          <AppText variant="caption" muted>
            {occasionLabels[outfit.occasion]} · {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
          </AppText>
        </View>
        <View style={{ gap: space.sm }}>
          <AppText variant="display">{verdict.title}</AppText>
          <AppText>{verdict.commentary}</AppText>
        </View>
        <View style={{ gap: space.sm }}>
          <AppText variant="title">Kriterler</AppText>
          {(Object.keys(criterionLabels) as (keyof Criteria)[]).map((key) => (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <AppText>{criterionLabels[key]}</AppText>
              <AppText>{verdict.criteria[key].score ?? '—'}</AppText>
            </View>
          ))}
        </View>
        <Button
          label={outfit.favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          onPress={toggleFavorite}
        />
        <ShareVerdictButton photoUri={photoFile(outfit.photo).uri} verdict={verdict} occasion={outfit.occasion} />
        <Button label="Kombini sil" variant="ghost" onPress={confirmDelete} />
      </ScrollView>
    </Screen>
  );
}
