import { AppointmentsProvider } from '../state/AppointmentsContext';
import { AuthProvider } from '../state/AuthContext';
import { MedicationsProvider } from '../state/MedicationsContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <MedicationsProvider>
        <AppointmentsProvider>{children}</AppointmentsProvider>
      </MedicationsProvider>
    </AuthProvider>
  );
}
