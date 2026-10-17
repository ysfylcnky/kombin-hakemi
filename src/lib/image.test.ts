import { resizeAction } from '@/lib/image';

describe('resizeAction', () => {
  it('limits the width of a landscape photo', () => {
    expect(resizeAction(4032, 3024)).toEqual({ width: 1024 });
  });

  it('limits the height of a portrait photo', () => {
    expect(resizeAction(3024, 4032)).toEqual({ height: 1024 });
  });

  it('limits a square photo by width', () => {
    expect(resizeAction(2000, 2000)).toEqual({ width: 1024 });
  });

  it('never upscales a small photo', () => {
    expect(resizeAction(800, 1024)).toBeNull();
  });
});
