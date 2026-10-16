import { Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { colors, typography } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
      <Text style={[typography.display, { color: colors.text }]}>Kombin Hakemi</Text>
    </View>
  );
}
