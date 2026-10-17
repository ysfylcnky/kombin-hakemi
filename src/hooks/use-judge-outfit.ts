import { useState } from 'react';

import type { JudgeRequest } from '@/lib/ai/schema';
import { judgeOutfit } from '@/lib/api/judge';
import { prepareImage } from '@/lib/image';

export function useJudgeOutfit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const judge = async (uri: string, occasion: JudgeRequest['occasion']) => {
    setLoading(true);
    setError(null);
    try {
      const image = await prepareImage(uri).catch(() => {
        throw new Error('Fotoğraf hazırlanamadı. Bir daha dene.');
      });
      return await judgeOutfit({ imageBase64: image.base64, occasion });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { judge, loading, error };
}
