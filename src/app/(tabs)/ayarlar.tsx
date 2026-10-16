import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';

export default function AyarlarScreen() {
  return (
    <Screen>
      <AppText variant="display">Ayarlar</AppText>
      <AppText muted>Ayarlar soyunma odasında hazırlanıyor.</AppText>
    </Screen>
  );
}
