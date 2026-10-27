import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useHealthLogs } from '../state/HealthLogsContext';

const symptoms = ['Knee pain', 'Fatigue', 'Headache', 'Dizziness', 'Nausea', 'Other'];

function formatRecordedAt(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function HealthLogPage() {
  const { logs, addHealthLog, storageError, clearStorageError } = useHealthLogs();
  const [symptom, setSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [shareWithCaregiver, setShareWithCaregiver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!symptom) {
      setValidationError('Choose a symptom before saving.');
      setAnnouncement('');
      document.getElementById('health-symptom')?.focus();
      return;
    }
    const saved = addHealthLog({ symptom, notes: notes.trim(), shareWithCaregiver });
    if (!saved) return;
    setSymptom('');
    setNotes('');
    setShareWithCaregiver(false);
    setValidationError('');
    setAnnouncement(`${saved.symptom} was added to your private health log.`);
  };

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Health log" description="Record symptoms and choose what to share" />
        <Link className="button button--secondary" to="/care">Back to Care</Link>
      </div>
      {storageError && <div className="inline-alert dismissible-alert" role="alert"><span>{storageError}</span><button type="button" onClick={clearStorageError}>Dismiss</button></div>}
      {announcement && <p className="settings-status" role="status">{announcement}</p>}

      <div className="health-log-layout">
        <form className="health-log-form" onSubmit={submit} noValidate>
          <h2>How are you feeling?</h2>
          <p className="required-note">Choose a symptom. Notes and sharing are optional.</p>
          <div className="form-field">
            <label htmlFor="health-symptom">Symptom</label>
            <select id="health-symptom" required value={symptom} aria-invalid={Boolean(validationError)} aria-describedby={validationError ? 'health-symptom-error' : undefined} onChange={(event) => { setSymptom(event.target.value); setValidationError(''); }}>
              <option value="">Choose a symptom</option>
              {symptoms.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {validationError && <p id="health-symptom-error" className="field-error" role="alert">{validationError}</p>}
          </div>
          <div className="form-field"><label htmlFor="health-notes">Private notes <span className="optional-text">Optional</span></label><textarea id="health-notes" value={notes} maxLength="500" onChange={(event) => setNotes(event.target.value)} /></div>
          <label className="toggle-row"><span><strong>Share this entry with my caregiver</strong><small>The entry stays private unless you select this option.</small></span><input type="checkbox" checked={shareWithCaregiver} onChange={(event) => setShareWithCaregiver(event.target.checked)} /></label>
          <button className="button button--primary" type="submit">Save health log</button>
        </form>

        <section className="health-log-history" aria-labelledby="health-history-title">
          <h2 id="health-history-title">Recent health logs</h2>
          {logs.length ? <ol className="health-log-list">{logs.map((log) => (
            <li key={log.id}>
              <div><strong>{log.symptom}</strong><time dateTime={log.recordedAt}>{formatRecordedAt(log.recordedAt)}</time></div>
              <p>{log.notes || 'No private note added.'}</p>
              <span>{log.shareWithCaregiver ? 'Shared with caregiver' : 'Private'}</span>
            </li>
          ))}</ol> : <p className="empty-copy" role="status">No symptoms logged yet.</p>}
        </section>
      </div>
    </>
  );
}
