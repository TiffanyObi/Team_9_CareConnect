import { Link, useParams } from 'react-router-dom';
import { DetailPanel } from '../components/DetailPanel';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { formatAppointmentDate, formatAppointmentTime } from '../utils/dateTime';

export function AppointmentConfirmationPage() {
  const { appointmentId } = useParams();
  const { getAppointment } = useAppointments();
  const appointment = getAppointment(appointmentId);

  if (!appointment) {
    return (
      <>
        <PageHeader title="Confirmation unavailable" description="Your care workspace · Demo information" />
        <section className="message-panel" role="status">
          <h2>The saved appointment could not be found.</h2>
          <Link className="button button--secondary" to="/appointments">Return to appointments</Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Validation & confirmation" description="Your care workspace · Demo information" />
      <section className="success-banner" role="status" aria-labelledby="confirmation-title">
        <h2 id="confirmation-title">Appointment saved</h2>
        <p>Your appointment was added to this device and is ready to review.</p>
      </section>

      <div className="workflow-grid confirmation-grid">
        <DetailPanel title="Required fields">
          <p>All required appointment information was provided.</p>
        </DetailPanel>
        <DetailPanel title="Error summary">
          <p>No validation errors remain.</p>
        </DetailPanel>
        <DetailPanel title="Confirmation">
          <p><strong>{appointment.type}</strong></p>
          <p>{appointment.provider}</p>
        </DetailPanel>
        <DetailPanel title="Saved date and time">
          <p>{formatAppointmentDate(appointment.date)}</p>
          <p>{formatAppointmentTime(appointment.date, appointment.time)}</p>
        </DetailPanel>
        <DetailPanel title="View appointment">
          <Link className="text-link" to={`/appointments/${appointment.id}`}>Open appointment details</Link>
        </DetailPanel>
        <DetailPanel title="Return to dashboard">
          <Link className="text-link" to="/">Go to the Dashboard</Link>
        </DetailPanel>
      </div>
    </>
  );
}
