import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { useAuth } from '../state/AuthContext';

const initialValues = {
  patient: '',
  provider: '',
  date: '',
  time: '',
  type: '',
  notes: '',
};

const providerLocations = {
  'Dr. Maya Chen': 'CareConnect Rehabilitation Center · Suite 210',
  'Dr. Daniel Brooks': 'Safeview Family Health · Room 4',
  'Jordan Lee, PT': 'CareConnect Physical Therapy · Studio B',
};

export function validateAppointment(values) {
  const errors = {};
  if (!values.provider) errors.provider = 'Select a provider.';
  if (!values.date) errors.date = 'Enter an appointment date.';
  if (!values.time) errors.time = 'Enter a start time.';
  if (!values.type) errors.type = 'Select a visit type.';

  if (values.date && values.time && new Date(`${values.date}T${values.time}:00`) <= new Date()) {
    errors.date = 'Choose an appointment date and time in the future.';
  }
  return errors;
}

export function NewAppointmentPage() {
  const { user } = useAuth();
  const [values, setValues] = useState({ ...initialValues, patient: user.name });
  const [errors, setErrors] = useState({});
  const errorSummaryRef = useRef(null);
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAppointment(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    const appointment = addAppointment({
      ...values,
      location: providerLocations[values.provider],
      contact: '(555) 014-2200',
    });
    navigate(`/appointments/confirmation/${appointment.id}`);
  };

  const errorEntries = Object.entries(errors).filter(([, message]) => message);

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="New appointment" description="Your care workspace · Demo information" />
        <Link className="button button--secondary" to="/appointments">Cancel</Link>
      </div>

      {errorEntries.length > 0 && (
        <section ref={errorSummaryRef} className="error-summary" role="alert" tabIndex="-1" aria-labelledby="error-summary-title">
          <h2 id="error-summary-title">Please correct the following information</h2>
          <ul>
            {errorEntries.map(([field, message]) => (
              <li key={field}><a href={`#${field}`}>{message}</a></li>
            ))}
          </ul>
        </section>
      )}

      <form className="appointment-form" noValidate onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="patient">Patient</label>
            <input id="patient" name="patient" value={values.patient} readOnly />
            <p className="field-help">This appointment will be added to the current demo workspace.</p>
          </div>

          <div className="form-field">
            <label htmlFor="provider">Provider <span aria-hidden="true">*</span></label>
            <select
              id="provider"
              name="provider"
              value={values.provider}
              aria-invalid={Boolean(errors.provider)}
              aria-describedby={errors.provider ? 'provider-error' : undefined}
              onChange={updateField}
            >
              <option value="">Select a provider</option>
              {Object.keys(providerLocations).map((provider) => <option key={provider}>{provider}</option>)}
            </select>
            {errors.provider && <p id="provider-error" className="field-error">{errors.provider}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="date">Appointment date <span aria-hidden="true">*</span></label>
            <input
              id="date"
              name="date"
              type="date"
              value={values.date}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'date-error' : undefined}
              onChange={updateField}
            />
            {errors.date && <p id="date-error" className="field-error">{errors.date}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="time">Start time <span aria-hidden="true">*</span></label>
            <input
              id="time"
              name="time"
              type="time"
              value={values.time}
              aria-invalid={Boolean(errors.time)}
              aria-describedby={errors.time ? 'time-error' : undefined}
              onChange={updateField}
            />
            {errors.time && <p id="time-error" className="field-error">{errors.time}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="type">Visit type <span aria-hidden="true">*</span></label>
            <select
              id="type"
              name="type"
              value={values.type}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? 'type-error' : undefined}
              onChange={updateField}
            >
              <option value="">Select a visit type</option>
              <option>Physical therapy follow-up</option>
              <option>Primary care check-in</option>
              <option>Medication review</option>
              <option>Specialist consultation</option>
            </select>
            {errors.type && <p id="type-error" className="field-error">{errors.type}</p>}
          </div>

          <div className="form-field form-field--wide">
            <label htmlFor="notes">Notes <span className="optional-text">Optional</span></label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={values.notes}
              onChange={updateField}
            />
          </div>
        </div>

        <p className="required-note"><span aria-hidden="true">*</span> Required field</p>
        <div className="form-actions">
          <Link className="button button--secondary" to="/appointments">Cancel</Link>
          <button className="button button--primary" type="submit">Save appointment</button>
        </div>
      </form>
    </>
  );
}
