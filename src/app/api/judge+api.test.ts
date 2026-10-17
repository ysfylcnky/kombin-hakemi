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

const valid = { imageBase64: 'abc', persona: 'spiker', harshness: 'durust' };

describe('POST /api/judge', () => {
  it('returns a verdict whose card matches the score', async () => {
    const res = await judge('ok', valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ score: 7.5, card: 'green' });
  });

  it('rejects an invalid body', async () => {
    const res = await judge('invalid', { ...valid, persona: 'dj' });
    expect(res.status).toBe(400);
  });

  it('limits a device to five requests a minute', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await judge('busy', {})).status).toBe(400);
    }
    expect((await judge('busy', valid)).status).toBe(429);
  });
});
