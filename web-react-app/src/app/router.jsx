import { createHashRouter, Outlet } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../routing/RequireAuth';
import { RouteErrorPage, NotFoundPage } from '../pages/RouteErrorPage';
import { AccessibilityOnboardingPage } from '../pages/AccessibilityOnboardingPage';
import { AppointmentConfirmationPage } from '../pages/AppointmentConfirmationPage';
import { AppointmentDetailsPage } from '../pages/AppointmentDetailsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { HelpPage } from '../pages/HelpPage';
import { LoginPage } from '../pages/LoginPage';
import { MedicationDetailsPage } from '../pages/MedicationDetailsPage';
import { MedicationsPage } from '../pages/MedicationsPage';
import { MessagesPage } from '../pages/MessagesPage';
import { NewAppointmentPage } from '../pages/NewAppointmentPage';
import { NewMedicationPage } from '../pages/NewMedicationPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { SearchVisitsPage } from '../pages/SearchVisitsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SignUpPage } from '../pages/SignUpPage';

export const appRoutes = [{
  element: <Outlet />,
  errorElement: <RouteErrorPage />,
  hydrateFallbackElement: <main className="route-loading" role="status">Loading your workspace…</main>,
  children: [
    { element: <AuthLayout />, children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ] },
    { element: <RequireAuth />, children: [
      { path: '/onboarding/accessibility', element: <AuthLayout />, children: [{ index: true, element: <AccessibilityOnboardingPage /> }] },
      { element: <RequireAuth requireOnboarding />, children: [{ path: '/', element: <AppLayout />, children: [
        { index: true, element: <DashboardPage /> },
        { path: 'appointments', element: <AppointmentsPage /> },
        { path: 'appointments/new', element: <NewAppointmentPage /> },
        { path: 'appointments/confirmation/:appointmentId', element: <AppointmentConfirmationPage /> },
        { path: 'appointments/:appointmentId', element: <AppointmentDetailsPage /> },
        { path: 'medications', element: <MedicationsPage /> },
        { path: 'medications/new', element: <NewMedicationPage /> },
        { path: 'medications/:medicationId', element: <MedicationDetailsPage /> },
        // Zach owns these remaining feature pages and route replacements.
        { path: 'messages', element: <MessagesPage /> },
        { path: 'search', element: <SearchVisitsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'help', element: <HelpPage /> },
        { path: 'visit-actions', element: <PlaceholderPage title="Visit actions" description="Complete visit-related tasks and review their status." /> },
        { path: '*', element: <NotFoundPage /> },
      ] }] },
    ] },
  ],
}];

export const router = createHashRouter(appRoutes);
