import { Link } from 'react-router-dom';

export function ContentCard({ title, description, to }) {
  const content = (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
    </>
  );

  return to ? (
    <Link className="content-card content-card--link" to={to}>{content}</Link>
  ) : (
    <article className="content-card">{content}</article>
  );
}
