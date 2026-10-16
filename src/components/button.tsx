import { Pressable, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = { label: string; onPress: () => void };

export function Button({ label, onPress }: Props) {
  const { colors, space, radius, typography } = useTheme();
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
        backgroundColor: colors.primary,
        opacity: pressed ? 0.7 : 1,
      })}>
      <Text style={[typography.body, { color: colors.bg }]}>{label}</Text>
    </Pressable>
  );
}
