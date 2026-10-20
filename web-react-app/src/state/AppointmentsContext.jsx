import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoAppointments } from '../data/appointments';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PREFIX = 'careconnect-safeview-appointments:';
const AppointmentsContext = createContext(null);

function loadAppointments(user) {
  if (!user) return [];
  try {
    const saved = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${user.id}`);
    if (saved) return JSON.parse(saved);
    return user.isDemo ? demoAppointments : [];
  } catch {
    return user.isDemo ? demoAppointments : [];
  }
}

export function AppointmentsProvider({ children }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(loadAppointments(user));
  }, [user?.id]);

  const value = useMemo(() => ({
    appointments,
    addAppointment(appointment) {
      const id = globalThis.crypto?.randomUUID?.() ?? `appointment-${Date.now()}`;
      const savedAppointment = { ...appointment, id };
      setAppointments((current) => {
        const nextAppointments = [...current, savedAppointment];
        if (user) {
          try {
            window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${user.id}`, JSON.stringify(nextAppointments));
          } catch {
            // The app remains usable when browser storage is unavailable.
          }
        }
        return nextAppointments;
      });
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
