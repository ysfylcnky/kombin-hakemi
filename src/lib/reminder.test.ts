import { reminderDates } from '@/lib/reminder';

describe('reminderDates', () => {
  it('starts today when not evaluated before 19:00', () => {
    const dates = reminderDates(new Date(2026, 11, 7, 10), false);
    expect(dates).toHaveLength(7);
    expect(dates[0]).toEqual(new Date(2026, 11, 7, 19));
    expect(dates[6]).toEqual(new Date(2026, 11, 13, 19));
  });

  it('skips today once evaluated', () => {
    expect(reminderDates(new Date(2026, 11, 7, 10), true)[0]).toEqual(new Date(2026, 11, 8, 19));
  });

  it('skips today after 19:00', () => {
    expect(reminderDates(new Date(2026, 11, 7, 19, 30), false)[0]).toEqual(new Date(2026, 11, 8, 19));
  });

  it('rolls over month end', () => {
    expect(reminderDates(new Date(2026, 11, 31, 20), false)[0]).toEqual(new Date(2027, 0, 1, 19));
  });
});
