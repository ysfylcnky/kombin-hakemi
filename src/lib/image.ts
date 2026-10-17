import { Directory, File, Paths } from 'expo-file-system';
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

// Only the file name is stored: the app container path can change between updates on iOS.
export const photoFile = (name: string) => new File(Paths.document, 'outfits', name);

export async function persistPhoto(uri: string) {
  new Directory(Paths.document, 'outfits').create({ idempotent: true });
  const name = `${Date.now()}.jpg`;
  await new File(uri).move(photoFile(name));
  return name;
}
