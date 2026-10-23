import { describe, expect, it } from 'vitest';
import { isSameLocalDay, latestMedicationLog, medicationLogsToday, sortMedicationLogs } from './medications';

const logs = [
  { id: 'old', medicationId: 'm1', takenAt: '2026-10-20T08:00:00.000Z' },
  { id: 'other', medicationId: 'm2', takenAt: '2026-10-20T09:00:00.000Z' },
  { id: 'new', medicationId: 'm1', takenAt: '2026-10-20T20:00:00.000Z' },
];

describe('medication utilities', () => {
  it('sorts dose history newest first and finds the latest medication dose', () => {
    expect(sortMedicationLogs(logs).map((log) => log.id)).toEqual(['new', 'other', 'old']);
    expect(latestMedicationLog(logs, 'm1')?.id).toBe('new');
  });

  it('supports multiple doses logged on the same local day', () => {
    const comparison = new Date('2026-10-20T23:00:00.000Z');
    expect(isSameLocalDay(logs[0].takenAt, comparison)).toBe(true);
    expect(medicationLogsToday(logs, 'm1', comparison)).toHaveLength(2);
  });
});
