import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';

const reminderHour = 19;

// One-shot triggers instead of a daily one, so a day with an evaluation can be skipped.
export function reminderDates(now: Date, evaluatedToday: boolean) {
  const skip = evaluatedToday || now.getHours() >= reminderHour ? 1 : 0;
  return Array.from(
    { length: 7 },
    (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + skip + i, reminderHour),
  );
}

// Reminders are best-effort; a failure must not break startup or saving.
export async function syncReminders(db: SQLiteDatabase) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (Storage.getItemSync('reminder') !== 'on') return;
    const now = new Date();
    const today = await db.getFirstAsync(
      'SELECT 1 FROM outfits WHERE createdAt >= ?',
      new Date(now).setHours(0, 0, 0, 0),
    );
    for (const date of reminderDates(now, today !== null)) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Prova', body: 'Bugünkü kombinini henüz değerlendirmedin.' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
    }
  } catch {}
}
