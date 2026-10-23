const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatMedicationLogTime(value) {
  return dateTimeFormatter.format(new Date(value));
}

export function isSameLocalDay(first, second = new Date()) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);
  return firstDate.getFullYear() === secondDate.getFullYear()
    && firstDate.getMonth() === secondDate.getMonth()
    && firstDate.getDate() === secondDate.getDate();
}

export function sortMedicationLogs(logs) {
  return [...logs].sort((first, second) => new Date(second.takenAt) - new Date(first.takenAt));
}

export function latestMedicationLog(logs, medicationId) {
  return sortMedicationLogs(logs.filter((log) => log.medicationId === medicationId))[0] || null;
}

export function medicationLogsToday(logs, medicationId, now = new Date()) {
  return logs.filter((log) => log.medicationId === medicationId && isSameLocalDay(log.takenAt, now));
}
