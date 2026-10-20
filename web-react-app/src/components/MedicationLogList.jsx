import { formatMedicationLogTime } from '../utils/medications';

export function MedicationLogList({ logs }) {
  if (!logs.length) return <p>No doses logged yet.</p>;
  return (
    <ol className="medication-log-list" aria-label="Medication history">
      {logs.map((log) => (
        <li key={log.id}>
          <strong>{log.medicationName} taken</strong>
          <span>{log.dosage}</span>
          <time dateTime={log.takenAt}>{formatMedicationLogTime(log.takenAt)}</time>
        </li>
      ))}
    </ol>
  );
}
