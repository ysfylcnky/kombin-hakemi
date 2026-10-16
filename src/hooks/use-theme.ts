import { useColorScheme } from 'react-native';

import { colors, radius, space, typography } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { colors: colors[scheme], space, radius, typography };
}
