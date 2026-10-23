import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useMedications } from '../state/MedicationsContext';

const initialValues = { name: '', dosage: '', schedule: '', instructions: '' };

export function validateMedication(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Enter a medication name.';
  if (!values.dosage.trim()) errors.dosage = 'Enter a dosage.';
  if (!values.schedule.trim()) errors.schedule = 'Enter a schedule.';
  if (!values.instructions.trim()) errors.instructions = 'Enter medication instructions.';
  return errors;
}

export function NewMedicationPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const errorSummaryRef = useRef(null);
  const { addMedication, storageError } = useMedications();
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateMedication(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    const medication = addMedication(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])));
    if (medication) navigate(`/medications/${medication.id}`);
  };

  const errorEntries = Object.entries(errors).filter(([, message]) => message);
  return (
    <>
      <div className="page-heading-row"><PageHeader title="Add medication" description="Create a medication schedule for this account" /><Link className="button button--secondary" to="/medications">Cancel</Link></div>
      <p className="demo-notice medication-demo-notice">Coursework demonstration only. Do not enter real medication or patient information.</p>
      {storageError && <p className="inline-alert" role="alert">{storageError}</p>}
      {errorEntries.length > 0 && <section ref={errorSummaryRef} className="error-summary" role="alert" tabIndex="-1" aria-labelledby="medication-error-title"><h2 id="medication-error-title">Please correct the following information</h2><ul>{errorEntries.map(([field, message]) => <li key={field}><a href={`#medication-${field}`}>{message}</a></li>)}</ul></section>}
      <form className="appointment-form" noValidate onSubmit={submit}>
        <div className="form-grid">
          {[
            ['name', 'Medication name', 'Example: Demonstration medication'],
            ['dosage', 'Dosage', 'Example: 10 mg'],
            ['schedule', 'Schedule', 'Example: 8:00 AM and 8:00 PM'],
            ['instructions', 'Instructions', 'Example: Take with water'],
          ].map(([name, label, placeholder]) => (
            <div className={`form-field${name === 'instructions' ? ' form-field--wide' : ''}`} key={name}>
              <label htmlFor={`medication-${name}`}>{label} <span aria-hidden="true">*</span></label>
              <input id={`medication-${name}`} name={name} value={values[name]} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `medication-${name}-error` : undefined} onChange={updateField} />
              {errors[name] && <p id={`medication-${name}-error`} className="field-error">{errors[name]}</p>}
            </div>
          ))}
        </div>
        <p className="required-note"><span aria-hidden="true">*</span> Required field</p>
        <div className="form-actions"><Link className="button button--secondary" to="/medications">Cancel</Link><button className="button button--primary" type="submit">Save medication</button></div>
      </form>
    </>
  );
}
