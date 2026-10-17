import { Pressable, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = { label: string; onPress: () => void; variant?: 'primary' | 'ghost' };

export function Button({ label, onPress, variant = 'primary' }: Props) {
  const { colors, space, radius, typography } = useTheme();
  const ghost = variant === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        paddingVertical: space.md,
        paddingHorizontal: space.xl,
        borderRadius: radius.pill,
        backgroundColor: ghost ? 'transparent' : colors.primary,
        borderWidth: ghost ? 1 : 0,
        borderColor: colors.border,
        opacity: pressed ? 0.7 : 1,
      })}>
      <Text style={[typography.body, { color: ghost ? colors.text : colors.bg }]}>{label}</Text>
    </Pressable>
  );
}
