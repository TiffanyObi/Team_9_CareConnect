import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MedicationLogList } from '../components/MedicationLogList';
import { PageHeader } from '../components/PageHeader';
import { useMedications } from '../state/MedicationsContext';
import { formatMedicationLogTime, latestMedicationLog, medicationLogsToday } from '../utils/medications';

export function MedicationDetailsPage() {
  const { medicationId } = useParams();
  const { getMedication, logs, logMedicationTaken, storageError, clearStorageError } = useMedications();
  const [announcement, setAnnouncement] = useState('');
  const medication = getMedication(medicationId);

  if (!medication) {
    return (
      <>
        <PageHeader title="Medication not found" description="The requested medication is unavailable" />
        <section className="message-panel" role="status"><h2>We could not find that medication.</h2><Link className="button button--secondary" to="/medications">Return to medications</Link></section>
      </>
    );
  }

  const medicationLogs = logs.filter((log) => log.medicationId === medication.id);
  const latestLog = latestMedicationLog(logs, medication.id);
  const todayCount = medicationLogsToday(logs, medication.id).length;
  const markTaken = () => {
    const saved = logMedicationTaken(medication.id);
    if (saved) setAnnouncement(`${medication.name} logged as taken at ${formatMedicationLogTime(saved.takenAt)}.`);
  };

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title={medication.name} description={`${medication.dosage} · ${medication.schedule}`} />
        <Link className="button button--secondary" to="/medications">Back to medications</Link>
      </div>

      {storageError && <div className="inline-alert dismissible-alert" role="alert"><span>{storageError}</span><button type="button" onClick={clearStorageError}>Dismiss</button></div>}
      {announcement && <p className="settings-status" role="status">{announcement}</p>}

      <div className="medication-detail-grid">
        <section className="dose-card" aria-labelledby="todays-dose-title">
          <h2 id="todays-dose-title">Today’s dose</h2>
          <p><strong>{todayCount ? `${todayCount} ${todayCount === 1 ? 'dose' : 'doses'} logged today` : 'Not logged today'}</strong></p>
          <p>{latestLog ? `Last taken ${formatMedicationLogTime(latestLog.takenAt)}` : 'No previous doses logged'}</p>
          <button className="button button--primary" type="button" onClick={markTaken}>Log as taken</button>
          <p className="field-help">This action remains available because some medications have multiple daily doses.</p>
        </section>
        <section className="medication-panel" aria-labelledby="instructions-title"><h2 id="instructions-title">Instructions</h2><p>{medication.instructions}</p><p><strong>Schedule:</strong> {medication.schedule}</p></section>
        <aside className="medication-panel medication-sharing" aria-labelledby="sharing-title"><h2 id="sharing-title">Sharing preview</h2><p>Caregiver sees: taken or missed status only. Your private notes remain private.</p></aside>
        <section className="medication-panel medication-panel--history" aria-labelledby="medicine-log-title"><h2 id="medicine-log-title">History for {medication.name}</h2><MedicationLogList logs={medicationLogs} /></section>
      </div>
    </>
  );
}
