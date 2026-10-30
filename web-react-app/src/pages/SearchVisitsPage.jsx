import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAppointments } from '../state/AppointmentsContext';
import { formatAppointmentDate, formatAppointmentTime, sortAppointments } from '../utils/dateTime';

const providerSpecialties = {
  'Dr. Maya Chen': 'Rehabilitation',
  'Dr. Daniel Brooks': 'Primary care',
  'Jordan Lee, PT': 'Physical therapy',
};

const initialFilters = {
  provider: '',
  specialty: '',
  dateFrom: '',
  dateTo: '',
  timeFrom: '',
  timeTo: '',
  subject: '',
};

function matchesFilters(appointment, filters) {
  if (filters.provider && appointment.provider !== filters.provider) return false;
  if (filters.specialty && providerSpecialties[appointment.provider] !== filters.specialty) return false;
  if (filters.dateFrom && appointment.date < filters.dateFrom) return false;
  if (filters.dateTo && appointment.date > filters.dateTo) return false;
  if (filters.timeFrom && appointment.time < filters.timeFrom) return false;
  if (filters.timeTo && appointment.time > filters.timeTo) return false;
  if (filters.subject && !appointment.type.toLowerCase().includes(filters.subject.trim().toLowerCase())) return false;
  return true;
}

export function SearchVisitsPage() {
  const { appointments } = useAppointments();
  const location = useLocation();
  const providerInputRef = useRef(null);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [error, setError] = useState('');

  const results = useMemo(() => {
    if (!appliedFilters) return [];
    return sortAppointments(appointments.filter((appointment) => matchesFilters(appointment, appliedFilters)));
  }, [appointments, appliedFilters]);

  useEffect(() => {
    if (location.state?.focusSearch) providerInputRef.current?.focus();
  }, [location.key, location.state]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const searchVisits = (event) => {
    event.preventDefault();
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
      setError('The start date must be on or before the end date.');
      setAppliedFilters(null);
      return;
    }
    if (filters.timeFrom && filters.timeTo && filters.timeFrom > filters.timeTo) {
      setError('The start time must be on or before the end time.');
      setAppliedFilters(null);
      return;
    }
    setError('');
    setAppliedFilters({ ...filters, subject: filters.subject.trim() });
  };

  const clearFilters = () => {
    setFilters({ ...initialFilters });
    setAppliedFilters(null);
    setError('');
  };

  return (
    <>
      <PageHeader title="Search visits" description="Find appointments in your care workspace · Demo information" />
      <form className="visit-search-form" onSubmit={searchVisits}>
        <div className="visit-search-grid">
          <label className="form-field" htmlFor="visit-provider">
            <span>Provider</span>
            <select id="visit-provider" ref={providerInputRef} name="provider" value={filters.provider} onChange={updateFilter}>
              <option value="">Any provider</option>
              {Object.keys(providerSpecialties).map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </label>

          <label className="form-field" htmlFor="visit-specialty">
            <span>Provider specialty</span>
            <select id="visit-specialty" name="specialty" value={filters.specialty} onChange={updateFilter}>
              <option value="">Any specialty</option>
              {[...new Set(Object.values(providerSpecialties))].map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </label>

          <fieldset className="visit-search-range">
            <legend>Date range</legend>
            <label>
              <span>From</span>
              <input aria-label="Date from" type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} />
            </label>
            <label>
              <span>To</span>
              <input aria-label="Date to" type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} />
            </label>
          </fieldset>

          <fieldset className="visit-search-range">
            <legend>Time range</legend>
            <label>
              <span>From</span>
              <input aria-label="Time from" type="time" name="timeFrom" value={filters.timeFrom} onChange={updateFilter} />
            </label>
            <label>
              <span>To</span>
              <input aria-label="Time to" type="time" name="timeTo" value={filters.timeTo} onChange={updateFilter} />
            </label>
          </fieldset>

          <label className="form-field visit-search-subject">
            <span>Subject</span>
            <input
              type="search"
              name="subject"
              value={filters.subject}
              onChange={updateFilter}
              placeholder="Search visit subject"
            />
          </label>
        </div>

        {error && <p className="inline-alert" role="alert">{error}</p>}
        <div className="visit-search-actions">
          <button className="button button--secondary" type="button" onClick={clearFilters}>Clear filters</button>
          <button className="button button--primary" type="submit">Search</button>
        </div>
      </form>

      {appliedFilters ? (
        <section className="visit-search-results" aria-labelledby="visit-search-results-heading" aria-live="polite">
          <h2 id="visit-search-results-heading">Search results</h2>
          <p className="visit-search-results__count">
            {results.length} {results.length === 1 ? 'visit' : 'visits'} found
          </p>
          {results.length ? (
            <ul className="visit-search-results__list">
              {results.map((appointment) => (
                <li key={appointment.id}>
                  <Link to={`/appointments/${appointment.id}`}>
                    <span className="visit-search-result__title">{appointment.type}</span>
                    <span>{appointment.provider} · {providerSpecialties[appointment.provider] || 'Specialty not specified'}</span>
                    <span>{formatAppointmentDate(appointment.date)} · {formatAppointmentTime(appointment.date, appointment.time)}</span>
                    <span>{appointment.location}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="visit-search-results__empty">No visits match these filters. Adjust your criteria and search again.</p>
          )}
        </section>
      ) : (
        <p className="visit-search-prompt">Choose any filters, then select Search to display matching visits.</p>
      )}
    </>
  );
}
