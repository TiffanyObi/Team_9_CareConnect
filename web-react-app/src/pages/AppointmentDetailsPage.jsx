import { Link, useParams } from 'react-router-dom';
import { DetailPanel } from '../components/DetailPanel';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { formatAppointmentDate, formatAppointmentTime } from '../utils/dateTime';

export function AppointmentDetailsPage() {
  const { appointmentId } = useParams();
  const { getAppointment } = useAppointments();
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

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Appointment details" description="Your care workspace · Demo information" />
        <Link className="button button--secondary" to="/appointments">Back to appointments</Link>
      </div>

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
