import type { SQLiteDatabase } from 'expo-sqlite';

import type { JudgeRequest, Level, Verdict } from '@/lib/ai/schema';
import { photoFile } from '@/lib/image';

export type OutfitRow = {
  id: number;
  photo: string;
  occasion: JudgeRequest['occasion'];
  score: number;
  level: Level;
  verdict: string;
  favorite: number;
  createdAt: number;
};

export type Outfit = Omit<OutfitRow, 'score' | 'level' | 'verdict' | 'favorite'> & {
  verdict: Verdict;
  favorite: boolean;
};

export type OutfitFilter = { favorites: boolean; level: Level | null; sort: 'date' | 'score' };

export async function migrateDb(db: SQLiteDatabase) {
  const { user_version } = (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version'))!;
  if (user_version >= 1) return;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE outfits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo TEXT NOT NULL,
      occasion TEXT NOT NULL,
      score REAL NOT NULL,
      level TEXT NOT NULL,
      verdict TEXT NOT NULL,
      favorite INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
    PRAGMA user_version = 1;
  `);
}

export function parseOutfit({ score, level, verdict, favorite, ...rest }: OutfitRow): Outfit {
  return { ...rest, verdict: JSON.parse(verdict), favorite: favorite === 1 };
}

export function filterOutfits(outfits: Outfit[], { favorites, level, sort }: OutfitFilter) {
  const result = outfits.filter(
    (o) => (!favorites || o.favorite) && (level === null || o.verdict.level === level),
  );
  return sort === 'score' ? result.sort((a, b) => b.verdict.score - a.verdict.score) : result;
}

export async function insertOutfit(
  db: SQLiteDatabase,
  { photo, occasion, verdict }: Pick<Outfit, 'photo' | 'occasion' | 'verdict'>,
) {
  const { lastInsertRowId } = await db.runAsync(
    'INSERT INTO outfits (photo, occasion, score, level, verdict, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    photo,
    occasion,
    verdict.score,
    verdict.level,
    JSON.stringify(verdict),
    Date.now(),
  );
  return lastInsertRowId;
}

export async function listOutfits(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<OutfitRow>('SELECT * FROM outfits ORDER BY createdAt DESC');
  return rows.map(parseOutfit);
}

export async function getOutfit(db: SQLiteDatabase, id: number) {
  const row = await db.getFirstAsync<OutfitRow>('SELECT * FROM outfits WHERE id = ?', id);
  return row ? parseOutfit(row) : null;
}

export async function setFavorite(db: SQLiteDatabase, id: number, favorite: boolean) {
  await db.runAsync('UPDATE outfits SET favorite = ? WHERE id = ?', favorite ? 1 : 0, id);
}

export async function deleteOutfit(db: SQLiteDatabase, { id, photo }: Pick<Outfit, 'id' | 'photo'>) {
  await db.runAsync('DELETE FROM outfits WHERE id = ?', id);
  const file = photoFile(photo);
  if (file.exists) file.delete();
}
