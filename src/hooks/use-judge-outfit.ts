import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import type { JudgeRequest } from '@/lib/ai/schema';
import { judgeOutfit } from '@/lib/api/judge';
import { insertOutfit } from '@/lib/db/outfits';
import { persistPhoto, prepareImage } from '@/lib/image';
import { syncReminders } from '@/lib/reminder';

export function useJudgeOutfit() {
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const judge = async (uri: string, occasion: JudgeRequest['occasion']) => {
    setLoading(true);
    setError(null);
    setSaveFailed(false);
    try {
      const image = await prepareImage(uri).catch(() => {
        throw new Error('Fotoğraf hazırlanamadı. Bir daha dene.');
      });
      const verdict = await judgeOutfit({ imageBase64: image.base64, occasion });
      if (verdict.isOutfit) {
        await persistPhoto(image.uri)
          .then((photo) => insertOutfit(db, { photo, occasion, verdict }))
          .then(() => void syncReminders(db), () => setSaveFailed(true));
      }
      return verdict;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { judge, loading, error, saveFailed };
}
