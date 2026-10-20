import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoAppointments } from '../data/appointments';

const STORAGE_KEY = 'careconnect-safeview-appointments';
const AppointmentsContext = createContext(null);

function loadAppointments() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoAppointments;
  } catch {
    return demoAppointments;
  }
}

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(loadAppointments);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }, [appointments]);

  const value = useMemo(() => ({
    appointments,
    addAppointment(appointment) {
      const id = globalThis.crypto?.randomUUID?.() ?? `appointment-${Date.now()}`;
      const savedAppointment = { ...appointment, id };
      setAppointments((current) => [...current, savedAppointment]);
      return savedAppointment;
    },
    getAppointment(id) {
      return appointments.find((appointment) => appointment.id === id);
    },
  }), [appointments]);

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentsProvider');
  return context;
}
