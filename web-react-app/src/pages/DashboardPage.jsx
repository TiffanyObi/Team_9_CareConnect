import { ContentCard } from '../components/ContentCard';
import { PageHeader } from '../components/PageHeader';

const cards = [
  { title: 'Upcoming visits', description: 'Review and manage your information', to: '/appointments' },
  { title: 'Quick actions', description: 'View details or make changes', to: '/appointments/new' },
  { title: 'Recent activity', description: 'Select to continue' },
  { title: 'Care notes', description: 'View details or make changes' },
  { title: 'Reminders', description: 'Select to continue' },
  { title: 'Your profile', description: 'View details or make changes', to: '/settings' },
];

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your care workspace · Demo information" />
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
