import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function HomeScreen() {
  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <AppText variant="display">Kombin Hakemi</AppText>
    </Screen>
  );
}
