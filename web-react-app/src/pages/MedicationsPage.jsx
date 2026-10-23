import { Link } from 'react-router-dom';
import { MedicationItem } from '../components/MedicationItem';
import { MedicationLogList } from '../components/MedicationLogList';
import { PageHeader } from '../components/PageHeader';
import { useMedications } from '../state/MedicationsContext';

export function MedicationsPage() {
  const { medications, logs, storageError, clearStorageError } = useMedications();
  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Medications" description="Your medication schedule and dose history" />
        <Link className="button button--primary" to="/medications/new">Add medication</Link>
      </div>

      {storageError && (
        <div className="inline-alert dismissible-alert" role="alert">
          <span>{storageError}</span>
          <button type="button" onClick={clearStorageError}>Dismiss</button>
        </div>
      )}

      <div className="medication-layout">
        <section className="medication-panel" aria-labelledby="current-medications-title">
          <h2 id="current-medications-title">Current medications</h2>
          {medications.length ? (
            <ul className="medication-list">{medications.map((medication) => <MedicationItem key={medication.id} medication={medication} />)}</ul>
          ) : (
            <div className="empty-state">
              <h3>No medications added</h3>
              <p>Add a demonstration medication to begin using dose reminders and history.</p>
              <Link className="button button--secondary" to="/medications/new">Add your first medication</Link>
            </div>
          )}
        </section>

        <section className="medication-panel medication-panel--history" aria-labelledby="medication-history-title">
          <h2 id="medication-history-title">Medication history</h2>
          <MedicationLogList logs={logs} />
        </section>
      </div>
    </>
  );
}
