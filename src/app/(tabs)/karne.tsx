import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function KarneScreen() {
  return (
    <Screen>
      <AppText variant="display">Karne</AppText>
      <AppText muted>Karnen henüz boş. Birkaç değerlendirmeden sonra gelişimin burada görünür.</AppText>
    </Screen>
  );
}
