import { Link } from 'react-router-dom';

export function MedicationItem({ medication }) {
  return (
    <li className="medication-item">
      <Link to={`/medications/${medication.id}`} aria-label={`View details for ${medication.name}`}>
        <strong>{medication.name}</strong>
        <span>{medication.dosage}</span>
        <span>{medication.schedule}</span>
      </Link>
    </li>
  );
}
