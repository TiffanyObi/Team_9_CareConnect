import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../routing/RequireAuth';
import { RouteErrorPage, NotFoundPage } from '../pages/RouteErrorPage';

const page = (load, name) => async () => ({ Component: (await load())[name] });

export const appRoutes = [{
  element: <Outlet />,
  errorElement: <RouteErrorPage />,
  hydrateFallbackElement: <main className="route-loading" role="status">Loading your workspace…</main>,
  children: [
    { element: <AuthLayout />, children: [
      { path: '/login', lazy: page(() => import('../pages/LoginPage'), 'LoginPage') },
      { path: '/signup', lazy: page(() => import('../pages/SignUpPage'), 'SignUpPage') },
      { path: '/forgot-password', lazy: page(() => import('../pages/ForgotPasswordPage'), 'ForgotPasswordPage') },
    ] },
    { element: <RequireAuth />, children: [
      {
        path: '/onboarding/accessibility',
        element: <AuthLayout />,
        children: [{
          index: true,
          lazy: page(() => import('../pages/AccessibilityOnboardingPage'), 'AccessibilityOnboardingPage'),
        }],
      },
      { element: <RequireAuth requireOnboarding />, children: [{ path: '/', element: <AppLayout />, children: [
        { index: true, lazy: page(() => import('../pages/DashboardPage'), 'DashboardPage') },
        { path: 'appointments', lazy: page(() => import('../pages/AppointmentsPage'), 'AppointmentsPage') },
        { path: 'appointments/new', lazy: page(() => import('../pages/NewAppointmentPage'), 'NewAppointmentPage') },
        { path: 'appointments/confirmation/:appointmentId', lazy: page(() => import('../pages/AppointmentConfirmationPage'), 'AppointmentConfirmationPage') },
        { path: 'appointments/:appointmentId/edit', lazy: page(() => import('../pages/NewAppointmentPage'), 'NewAppointmentPage') },
        { path: 'appointments/:appointmentId', lazy: page(() => import('../pages/AppointmentDetailsPage'), 'AppointmentDetailsPage') },
        { path: 'medications', lazy: page(() => import('../pages/MedicationsPage'), 'MedicationsPage') },
        { path: 'medications/new', lazy: page(() => import('../pages/NewMedicationPage'), 'NewMedicationPage') },
        { path: 'medications/:medicationId', lazy: page(() => import('../pages/MedicationDetailsPage'), 'MedicationDetailsPage') },
        { path: 'care', lazy: page(() => import('../pages/CarePage'), 'CarePage') },
        { path: 'care/health-log', lazy: page(() => import('../pages/HealthLogPage'), 'HealthLogPage') },
        { path: 'care/emergency', lazy: page(() => import('../pages/EmergencyPage'), 'EmergencyPage') },
        { path: 'messages', lazy: page(() => import('../pages/MessagesPage'), 'MessagesPage') },
        { path: 'search', lazy: page(() => import('../pages/SearchVisitsPage'), 'SearchVisitsPage') },
        { path: 'settings', lazy: page(() => import('../pages/SettingsPage'), 'SettingsPage') },
        { path: 'help', lazy: page(() => import('../pages/HelpPage'), 'HelpPage') },
        { path: 'visit-actions', element: <Navigate to="/appointments" replace /> },
        { path: '*', element: <NotFoundPage /> },
      ] }] },
    ] },
  ],
}];

export const router = createHashRouter(appRoutes);
