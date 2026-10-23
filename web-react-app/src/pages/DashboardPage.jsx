import { ContentCard } from '../components/ContentCard';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { useAuth } from '../state/AuthContext';
import { useMedications } from '../state/MedicationsContext';
import { formatAppointmentDate, isUpcomingAppointment, sortAppointments } from '../utils/dateTime';
import { formatMedicationLogTime, sortMedicationLogs } from '../utils/medications';

export function DashboardPage() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { medications, logs } = useMedications();
  const nextAppointment = sortAppointments(appointments.filter(isUpcomingAppointment))[0];
  const latestLog = sortMedicationLogs(logs)[0];
  const medicationDescription = medications.length
    ? `${medications.length} current ${medications.length === 1 ? 'medication' : 'medications'} · ${latestLog ? `last logged ${formatMedicationLogTime(latestLog.takenAt)}` : 'no doses logged yet'}`
    : 'No medications added yet';
  const cards = [
    { title: 'Upcoming visits', description: nextAppointment ? `${nextAppointment.type} · ${formatAppointmentDate(nextAppointment.date)}` : 'No upcoming appointments', to: '/appointments' },
    { title: 'Medications', description: medicationDescription, to: '/medications' },
    { title: 'Add appointment', description: 'Schedule a new care visit', to: '/appointments/new' },
    { title: 'Add medication', description: 'Create a medication schedule', to: '/medications/new' },
    { title: 'Recent medication activity', description: latestLog ? `${latestLog.medicationName} taken · ${formatMedicationLogTime(latestLog.takenAt)}` : 'No medication activity yet', to: '/medications' },
    { title: 'Your profile', description: 'Manage accessibility, privacy, and account settings', to: '/settings' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description={`${user.name}'s care workspace · Demo information`} />
      <section className="card-grid" aria-label="Dashboard information">
        {cards.map((card) => <ContentCard key={card.title} {...card} />)}
      </section>
      <aside className="experience-panel" aria-labelledby="experience-title">
        <h2 id="experience-title">CareConnect web experience</h2>
        <p>Responsive layout · keyboard support · accessible status messages</p>
      </aside>
    </>
  );
}
