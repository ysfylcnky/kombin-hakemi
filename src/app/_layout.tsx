import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { useEffect } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { migrateDb } from '@/lib/db/outfits';

SplashScreen.preventAutoHideAsync();
Appearance.setColorScheme((Storage.getItemSync('theme') ?? 'unspecified') as ColorSchemeName);

export default function RootLayout() {
  const { colors } = useTheme();
  const [loaded, error] = useFonts({
    Inter_400Regular: require('@/assets/fonts/Inter_400Regular.ttf'),
    Inter_900Black: require('@/assets/fonts/Inter_900Black.ttf'),
    PlayfairDisplay_600SemiBold: require('@/assets/fonts/PlayfairDisplay_600SemiBold.ttf'),
    PlayfairDisplay_700Bold: require('@/assets/fonts/PlayfairDisplay_700Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // On font failure, render anyway with system fonts rather than hang on the splash.
  if (!loaded && !error) return null;

  return (
    <SQLiteProvider databaseName="prova.db" onInit={migrateDb}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </SQLiteProvider>
  );
}
