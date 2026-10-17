import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const MAX_SIDE = 1024;

export function resizeAction(width: number, height: number, max = MAX_SIDE) {
  if (Math.max(width, height) <= max) return null;
  return width >= height ? { width: max } : { height: max };
}

export async function prepareImage(uri: string) {
  const original = await ImageManipulator.manipulate(uri).renderAsync();
  const size = resizeAction(original.width, original.height);
  const image = size ? await ImageManipulator.manipulate(original).resize(size).renderAsync() : original;
  const result = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
  return { uri: result.uri, base64: result.base64 ?? '' };
}
