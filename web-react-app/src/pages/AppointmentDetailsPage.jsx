import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { DetailPanel } from '../components/DetailPanel';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { formatAppointmentDate, formatAppointmentTime } from '../utils/dateTime';

export function AppointmentDetailsPage() {
  const { appointmentId } = useParams();
  const { getAppointment, updateAppointment } = useAppointments();
  const [copyStatus, setCopyStatus] = useState('');
  const [checkInError, setCheckInError] = useState('');
  const appointment = getAppointment(appointmentId);

  if (!appointment) {
    return (
      <>
        <PageHeader title="Appointment not found" description="Your care workspace · Demo information" />
        <section className="message-panel" role="status">
          <h2>We could not find that appointment.</h2>
          <p>It may have been removed or the link may be incorrect.</p>
          <Link className="button button--secondary" to="/appointments">Return to appointments</Link>
        </section>
      </>
    );
  }

  const copyDetails = async () => {
    const details = `${appointment.type} | ${appointment.date} ${appointment.time} | ${appointment.location}`;
    try {
      await navigator.clipboard.writeText(details);
      setCopyStatus('Appointment details copied.');
    } catch {
      setCopyStatus('Could not copy appointment details. Select and copy the details instead.');
    }
  };

  const checkIn = () => {
    setCheckInError('');
    const checkedInAppointment = updateAppointment(appointment.id, { checkedIn: true });
    if (!checkedInAppointment) {
      setCheckInError('Check-in could not be saved on this device. Please try again.');
    }
  };

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Appointment details" description="Your care workspace · Demo information" />
        <div className="appointment-detail-actions">
          {!appointment.checkedIn && (
            <button className="button button--primary" type="button" onClick={checkIn}>Check-in</button>
          )}
          <Link className="button button--secondary" to={`/appointments/${appointment.id}/edit`}>Edit appointment</Link>
          <Link className="button button--secondary" to="/care/health-log">Add health update</Link>
          <Link className="button button--secondary" to="/messages">Message care team</Link>
          <button className="button button--secondary" type="button" onClick={copyDetails}>Copy details</button>
          <Link className="button button--secondary" to="/appointments">Back to appointments</Link>
        </div>
      </div>
      {appointment.checkedIn && (
        <section className="success-banner" role="status" aria-label="Appointment check-in">
          <h2>You have been checked in</h2>
          <p>Your check-in for this appointment is complete.</p>
        </section>
      )}
      {checkInError && <p className="inline-alert" role="alert">{checkInError}</p>}
      {copyStatus && <p className="settings-status" role="status">{copyStatus}</p>}

      <div className="workflow-grid">
        <DetailPanel title="Visit summary">
          <p><strong>{appointment.type}</strong></p>
          <p>{appointment.patient} with {appointment.provider}</p>
        </DetailPanel>
        <DetailPanel title="Date and time">
          <p>{formatAppointmentDate(appointment.date)}</p>
          <p>{formatAppointmentTime(appointment.date, appointment.time)}</p>
        </DetailPanel>
        <DetailPanel title="Location">
          <p>{appointment.location}</p>
        </DetailPanel>
        <DetailPanel title="Notes">
          <p>{appointment.notes || 'No notes were added.'}</p>
        </DetailPanel>
        <DetailPanel title="Contact">
          <p>{appointment.provider}</p>
          <p>{appointment.contact || '(555) 014-2200'}</p>
        </DetailPanel>
        <DetailPanel title="More actions">
          <p>Need another visit?</p>
          <Link className="text-link" to="/appointments/new">Schedule a new appointment</Link>
        </DetailPanel>
      </div>

      <aside className="experience-panel" aria-labelledby="details-experience-title">
        <h2 id="details-experience-title">CareConnect web experience</h2>
        <p>Readable visit summary · consistent information groups · keyboard-accessible actions</p>
      </aside>
    </>
  );
}
