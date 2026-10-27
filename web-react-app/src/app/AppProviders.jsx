import { AppointmentsProvider } from '../state/AppointmentsContext';
import { AuthProvider } from '../state/AuthContext';
import { MedicationsProvider } from '../state/MedicationsContext';
import { HealthLogsProvider } from '../state/HealthLogsContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <MedicationsProvider>
        <AppointmentsProvider>
          <HealthLogsProvider>{children}</HealthLogsProvider>
        </AppointmentsProvider>
      </MedicationsProvider>
    </AuthProvider>
  );
}
