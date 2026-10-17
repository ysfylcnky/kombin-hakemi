import { router } from 'expo-router';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';

export default function HakemScreen() {
  const { space } = useTheme();
  return (
    <Screen style={{ gap: space.lg }}>
      <AppText variant="display">Hakem</AppText>
      <AppText muted>Düdük hazır. Kombinini çek, sahaya çık.</AppText>
      <Button label="Kombinini çek" onPress={() => router.push('/kamera')} />
    </Screen>
  );
}
