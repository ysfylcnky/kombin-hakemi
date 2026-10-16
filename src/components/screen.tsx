import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type Props = { children: ReactNode; style?: StyleProp<ViewStyle> };

export function Screen({ children, style }: Props) {
  const { colors, space } = useTheme();
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.bg, padding: space.xl }, style]}>
      {children}
    </SafeAreaView>
  );
}
