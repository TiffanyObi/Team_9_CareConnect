import { Link } from 'react-router-dom';
import { AppointmentItem } from '../components/AppointmentItem';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { useHealthLogs } from '../state/HealthLogsContext';
import { isUpcomingAppointment, sortAppointments } from '../utils/dateTime';

export function CarePage() {
  const { appointments } = useAppointments();
  const { logs } = useHealthLogs();
  const upcoming = sortAppointments(appointments.filter(isUpcomingAppointment));

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Care" description="Appointments, health updates, and urgent assistance" />
        <Link className="button button--primary" to="/appointments/new">Add appointment</Link>
      </div>

      <div className="care-layout">
        <section className="care-panel care-panel--appointments" aria-labelledby="care-appointments-title">
          <div className="care-panel__heading">
            <div><h2 id="care-appointments-title">Upcoming appointments</h2><p>Open a visit to review details or check in.</p></div>
            <Link className="text-link" to="/appointments">View all appointments</Link>
          </div>
          {upcoming.length ? (
            <ul className="appointment-list">{upcoming.slice(0, 3).map((appointment) => <AppointmentItem key={appointment.id} appointment={appointment} />)}</ul>
          ) : <p className="empty-copy" role="status">No upcoming appointments.</p>}
        </section>

        <section className="care-panel" aria-labelledby="health-log-summary-title">
          <h2 id="health-log-summary-title">Health log</h2>
          <p>{logs.length ? `${logs.length} ${logs.length === 1 ? 'entry' : 'entries'} saved privately on this device.` : 'No symptoms logged yet.'}</p>
          <Link className="button button--secondary" to="/care/health-log">Open health log</Link>
        </section>

        <section className="care-panel care-panel--emergency" aria-labelledby="emergency-summary-title">
          <h2 id="emergency-summary-title">Emergency assistance</h2>
          <p>Review urgent options in a calm, static view. This coursework prototype does not place calls.</p>
          <Link className="button button--emergency" to="/care/emergency">Emergency assistance</Link>
        </section>
      </div>
    </>
  );
}
