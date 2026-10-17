import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Storage from 'expo-sqlite/kv-store';

import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  if (Storage.getItemSync('onboarded') !== '1') return <Redirect href="/tanitim" />;

  return (
    <NativeTabs
      backgroundColor={colors.bg}
      indicatorColor={colors.surface}
      tintColor={colors.primary}
      iconColor={{ default: colors.textMuted, selected: colors.primary }}
      labelStyle={{ default: { color: colors.textMuted }, selected: { color: colors.primary } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Prova</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="camera.viewfinder" md="photo_camera" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="dolap">
        <NativeTabs.Trigger.Label>Dolap</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="hanger" md="checkroom" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="karne">
        <NativeTabs.Trigger.Label>Karne</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar" md="bar_chart" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ayarlar">
        <NativeTabs.Trigger.Label>Ayarlar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
