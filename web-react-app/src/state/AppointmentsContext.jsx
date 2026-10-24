import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { demoAppointments } from '../data/appointments';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PREFIX = 'careconnect-safeview-appointments:';
const AppointmentsContext = createContext(null);

function loadAppointments(user) {
  if (!user) return [];
  try {
    const saved = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error('Invalid saved appointments');
      return parsed;
    }
    return user.isDemo ? demoAppointments : [];
  } catch {
    return user.isDemo ? demoAppointments : [];
  }
}

export function AppointmentsProvider({ children }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const currentAppointments = useRef([]);

  useEffect(() => {
    currentAppointments.current = loadAppointments(user);
    setAppointments(currentAppointments.current);
  }, [user?.id]);

  const value = useMemo(() => ({
    appointments,
    addAppointment(appointment) {
      if (!user) throw new Error('Log in before saving an appointment.');
      const id = globalThis.crypto?.randomUUID?.() ?? `appointment-${Date.now()}`;
      const savedAppointment = { ...appointment, id };
      const nextAppointments = [...currentAppointments.current, savedAppointment];
      // A storage failure must keep the form open, not show confirmation.
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${user.id}`, JSON.stringify(nextAppointments));
      currentAppointments.current = nextAppointments;
      setAppointments(nextAppointments);
      return savedAppointment;
    },
    getAppointment(id) {
      return appointments.find((appointment) => appointment.id === id);
    },
  }), [appointments, user]);

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentsProvider');
  return context;
}
