import { PageHeader } from '../components/PageHeader';

export function PlaceholderPage({ title, description }) {
  return (
    <>
      <PageHeader title={title} description="Your care workspace · Demo information" />
      <section className="placeholder-card" aria-labelledby="placeholder-title">
        <h2 id="placeholder-title">{title}</h2>
        <p>{description}</p>
        <p className="placeholder-card__note">This screen is ready for the next implementation milestone.</p>
      </section>
    </>
  );
}
