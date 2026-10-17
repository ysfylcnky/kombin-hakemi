import type { SQLiteDatabase } from 'expo-sqlite';

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
