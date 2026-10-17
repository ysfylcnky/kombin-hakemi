import { Text, type TextProps } from 'react-native';

import type { typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextProps & { variant?: keyof typeof typography; muted?: boolean };

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  const { colors, typography } = useTheme();
  return (
    <Text
      accessibilityRole={variant === 'display' || variant === 'title' ? 'header' : undefined}
      style={[typography[variant], { color: muted ? colors.textMuted : colors.text }, style]}
      {...rest}
    />
  );
}
