import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The live preview is always dark, so overlay controls use the dark palette in both themes.
const overlay = colors.dark;

export default function KameraScreen() {
  const { space, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);

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

  const capture = async () => {
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!reduceMotion) {
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    }
    try {
      const photo = await camera.current?.takePictureAsync();
      if (photo) router.push({ pathname: '/onizleme', params: { uri: photo.uri } });
    } catch {
      Alert.alert('Çekim olmadı', 'Bir daha dene.');
    }
    setBusy(false);
  };

  const guide = { borderWidth: 2, borderStyle: 'dashed', borderColor: overlay.text } as const;
  const chip = { padding: space.md, borderRadius: radius.pill, backgroundColor: overlay.bg } as const;

  return (
    <View style={{ flex: 1, backgroundColor: overlay.bg }}>
      <StatusBar style="light" />
      <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={facing} />

      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', opacity: 0.6 }]}>
        <View style={[guide, { width: '20%', aspectRatio: 1, borderRadius: radius.pill }]} />
        <View style={[guide, { width: '50%', height: '58%', marginTop: space.sm, borderRadius: radius.lg }]} />
      </View>

      <View
        style={{
          position: 'absolute',
          top: insets.top + space.sm,
          left: space.lg,
          right: space.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Kapat" onPress={() => router.back()} style={chip}>
          <AppText style={{ color: overlay.text }}>Kapat</AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kamerayı çevir"
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          style={chip}>
          <AppText style={{ color: overlay.text }}>Çevir</AppText>
        </Pressable>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + space.xl,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: space.lg,
        }}>
        <AppText variant="caption" style={{ color: overlay.text }}>
          Boydan sığ, kılavuza otur.
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fotoğraf çek"
          disabled={busy}
          onPress={capture}
          style={({ pressed }) => ({
            width: space.xxl * 2,
            aspectRatio: 1,
            borderRadius: radius.pill,
            borderWidth: space.xs,
            borderColor: overlay.text,
            backgroundColor: overlay.primary,
            opacity: pressed || busy ? 0.7 : 1,
          })}
        />
      </View>

      {flash && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: overlay.text }]} />}
    </View>
  );
}
