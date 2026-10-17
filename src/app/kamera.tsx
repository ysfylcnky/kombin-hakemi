import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useTheme } from '@/hooks/use-theme';

export default function KameraScreen() {
  const { space } = useTheme();
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  // The hook never re-checks, so a grant made in Settings would go unnoticed on return.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') getPermission();
    });
    return () => sub.remove();
  }, [getPermission]);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Screen style={{ justifyContent: 'center', gap: space.lg }}>
        <AppText variant="display">Hakem görmeden karar vermez</AppText>
        <AppText muted>
          {permission.canAskAgain
            ? 'Kombinini değerlendirebilmem için kameraya erişmem lazım.'
            : "Kamera izni kapalı. Ayarlar'dan açarsan düdüğü çalarım."}
        </AppText>
        {permission.canAskAgain ? (
          <Button label="Kameraya izin ver" onPress={requestPermission} />
        ) : (
          <Button label="Ayarlar'ı aç" onPress={() => Linking.openSettings()} />
        )}
      </Screen>
    );
  }

  return <CameraView style={{ flex: 1 }} />;
}
