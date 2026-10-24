import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../routing/RequireAuth';
import { RouteErrorPage, NotFoundPage } from '../pages/RouteErrorPage';
import { HelpPage } from '../pages/HelpPage';
import { MessagesPage } from '../pages/MessagesPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { SearchVisitsPage } from '../pages/SearchVisitsPage';
import { SettingsPage } from '../pages/SettingsPage';

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
      { path: '/onboarding/accessibility', element: <AuthLayout />, children: [{ index: true, lazy: page(() => import('../pages/AccessibilityOnboardingPage'), 'AccessibilityOnboardingPage') }] },
      { element: <RequireAuth requireOnboarding />, children: [{ path: '/', element: <AppLayout />, children: [
        { index: true, lazy: page(() => import('../pages/DashboardPage'), 'DashboardPage') },
        { path: 'appointments', lazy: page(() => import('../pages/AppointmentsPage'), 'AppointmentsPage') },
        { path: 'appointments/new', lazy: page(() => import('../pages/NewAppointmentPage'), 'NewAppointmentPage') },
        { path: 'appointments/confirmation/:appointmentId', lazy: page(() => import('../pages/AppointmentConfirmationPage'), 'AppointmentConfirmationPage') },
        { path: 'appointments/:appointmentId', lazy: page(() => import('../pages/AppointmentDetailsPage'), 'AppointmentDetailsPage') },
        { path: 'medications', lazy: page(() => import('../pages/MedicationsPage'), 'MedicationsPage') },
        { path: 'medications/new', lazy: page(() => import('../pages/NewMedicationPage'), 'NewMedicationPage') },
        { path: 'medications/:medicationId', lazy: page(() => import('../pages/MedicationDetailsPage'), 'MedicationDetailsPage') },
        // Zach owns these remaining feature pages and route replacements.
        { path: 'messages', element: <MessagesPage /> },
        { path: 'search', element: <SearchVisitsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'help', element: <HelpPage /> },
        { path: 'search', element: <PlaceholderPage title="Search visits" description="Find appointments using accessible search and filters." /> },
        { path: 'visit-actions', element: <PlaceholderPage title="Visit actions" description="Complete visit-related tasks and review their status." /> },
        { path: 'settings', lazy: page(() => import('../pages/SettingsPage'), 'SettingsPage') },
        { path: 'help', element: <PlaceholderPage title="Help & shortcuts" description="Review help resources and keyboard shortcuts." /> },
        { path: '*', element: <NotFoundPage /> },
      ] }] },
    ] },
  ],
}];

export const router = createBrowserRouter(appRoutes);
