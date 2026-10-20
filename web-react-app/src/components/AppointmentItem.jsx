import { Link } from 'react-router-dom';
import { formatAppointmentDate, formatAppointmentTime } from '../utils/dateTime';

export function AppointmentItem({ appointment }) {
  return (
    <li className="appointment-item">
      <Link to={`/appointments/${appointment.id}`}>
        <span className="appointment-item__type">{appointment.type}</span>
        <span>{appointment.provider}</span>
        <span>{formatAppointmentDate(appointment.date)} · {formatAppointmentTime(appointment.date, appointment.time)}</span>
      </Link>
    </li>
  );
}
