import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';

export default function ProvaScreen() {
  const { space } = useTheme();

  const pick = async () => {
    try {
      const result = await launchImageLibraryAsync({ mediaTypes: ['images'] });
      if (!result.canceled) router.push({ pathname: '/onizleme', params: { uri: result.assets[0].uri } });
    } catch {
      Alert.alert('Galeri açılamadı', 'Bir daha dene ya da kamerayla çek.');
    }
  };

  return (
    <Screen style={{ gap: space.lg }}>
      <AppText variant="display">Prova</AppText>
      <AppText muted>Kombinini boydan çek; renk, oran ve kalıp üzerinden değerlendirelim.</AppText>
      <Button label="Kombinini çek" onPress={() => router.push('/kamera')} />
      <Button label="Galeriden seç" variant="ghost" onPress={pick} />
    </Screen>
  );
}
