const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

export function toLocalDate(date) {
  return new Date(`${date}T00:00:00`);
}

export function formatAppointmentDate(date) {
  return dateFormatter.format(toLocalDate(date));
}

export function formatAppointmentTime(date, time) {
  return timeFormatter.format(new Date(`${date}T${time}:00`));
}

export function isUpcomingAppointment(appointment, now = new Date()) {
  return new Date(`${appointment.date}T${appointment.time}:00`) > now;
}

export function sortAppointments(appointments) {
  return [...appointments].sort((a, b) => (
    new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`)
  ));
}
