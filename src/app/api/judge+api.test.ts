/**
 * @jest-environment node
 */
import { POST } from '@/app/api/judge+api';

process.env.AI_MOCK = '1';

function judge(deviceId: string, body: unknown) {
  return POST(
    new Request('http://localhost/api/judge', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-device-id': deviceId },
      body: JSON.stringify(body),
    }),
  );
}

const valid = { imageBase64: 'abc' };

describe('POST /api/judge', () => {
  it('returns a verdict with the computed score and level', async () => {
    const res = await judge('ok', valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ score: 5.5, level: 'developing' });
  });

  it('rejects an invalid body', async () => {
    const res = await judge('invalid', { imageBase64: '' });
    expect(res.status).toBe(400);
  });

  it('limits a device to five requests a minute', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await judge('busy', {})).status).toBe(400);
    }
    expect((await judge('busy', valid)).status).toBe(429);
  });
});
