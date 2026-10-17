import { judgeWithClaude } from '@/lib/ai/claude';
import { JudgeRequest } from '@/lib/ai/schema';

const system = 'Sen bir kombin hakemisin. Kararını hakem_karari aracıyla Türkçe ver.';

export async function POST(request: Request) {
  const { imageBase64 } = JudgeRequest.parse(await request.json());
  return Response.json(await judgeWithClaude(system, imageBase64));
}
