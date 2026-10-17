import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function DolapScreen() {
  return (
    <Screen>
      <AppText variant="display">Dolap</AppText>
      <AppText muted>Dolabın henüz boş. İlk kombinini değerlendir, burada saklansın.</AppText>
    </Screen>
  );
}
