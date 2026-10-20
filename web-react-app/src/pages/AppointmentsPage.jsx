import { Link } from 'react-router-dom';
import { AppointmentItem } from '../components/AppointmentItem';
import { DetailPanel } from '../components/DetailPanel';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { isUpcomingAppointment, sortAppointments } from '../utils/dateTime';

export function AppointmentsPage() {
  const { appointments } = useAppointments();
  const upcoming = sortAppointments(appointments.filter(isUpcomingAppointment));
  const past = sortAppointments(appointments.filter((appointment) => !isUpcomingAppointment(appointment))).reverse();
  const nextAppointment = upcoming[0];

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Appointments" description="Your care workspace · Demo information" />
        <Link className="button button--primary" to="/appointments/new">Add appointment</Link>
      </div>

      <div className="workflow-grid">
        <DetailPanel title="Upcoming appointments">
          {upcoming.length ? (
            <ul className="appointment-list">
              {upcoming.map((appointment) => <AppointmentItem key={appointment.id} appointment={appointment} />)}
            </ul>
          ) : <p>No upcoming appointments.</p>}
        </DetailPanel>

        <DetailPanel title="Past appointments">
          {past.length ? (
            <ul className="appointment-list">
              {past.map((appointment) => <AppointmentItem key={appointment.id} appointment={appointment} />)}
            </ul>
          ) : <p>No past appointments.</p>}
        </DetailPanel>

        <DetailPanel title="Visit details">
          {nextAppointment ? (
            <>
              <p><strong>Next:</strong> {nextAppointment.type}</p>
              <Link className="text-link" to={`/appointments/${nextAppointment.id}`}>Open appointment details</Link>
            </>
          ) : <p>Add an appointment to see visit details.</p>}
        </DetailPanel>

        <DetailPanel title="Appointment actions">
          <p>Create a new appointment or review an existing visit.</p>
          <Link className="text-link" to="/appointments/new">Schedule an appointment</Link>
        </DetailPanel>

        <DetailPanel title="Calendar">
          <p>{upcoming.length} upcoming {upcoming.length === 1 ? 'visit' : 'visits'} in your care schedule.</p>
        </DetailPanel>

        <DetailPanel title="Filters">
          <p>Upcoming and past appointments are separated for easier review.</p>
        </DetailPanel>
      </div>

      <aside className="experience-panel" aria-labelledby="appointments-experience-title">
        <h2 id="appointments-experience-title">CareConnect web experience</h2>
        <p>Responsive appointment cards · keyboard-accessible links · clear visit status</p>
      </aside>
    </>
  );
}
