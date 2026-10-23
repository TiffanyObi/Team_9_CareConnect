import { describe, expect, it } from 'vitest';
import { isUpcomingAppointment } from '../src/utils/dateTime';

describe('visit date boundaries', () => {
  const now = new Date('2026-10-23T12:00:00');
  it.each([
    ['2026-10-23', '15:30', true],
    ['2026-10-23', '09:00', false],
    ['2026-10-23', '12:00', false],
    ['2026-10-24', '09:00', true],
    ['bad', '09:00', false],
  ])('classifies %s at %s', (date, time, expected) => {
    expect(isUpcomingAppointment({ date, time }, now)).toBe(expected);
  });
});
