import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function KarneScreen() {
  return (
    <Screen>
      <AppText variant="display">Karne</AppText>
      <AppText muted>Karne boş. Önce maça çıkman lazım.</AppText>
    </Screen>
  );
}
