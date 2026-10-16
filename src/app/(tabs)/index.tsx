import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function HakemScreen() {
  return (
    <Screen>
      <AppText variant="display">Hakem</AppText>
      <AppText muted>Düdük hazır. Kombinini çekip sahaya çıkmak çok yakında.</AppText>
    </Screen>
  );
}
