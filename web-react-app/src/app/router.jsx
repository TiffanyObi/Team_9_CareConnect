import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { AppointmentConfirmationPage } from '../pages/AppointmentConfirmationPage';
import { AppointmentDetailsPage } from '../pages/AppointmentDetailsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { NewAppointmentPage } from '../pages/NewAppointmentPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'appointments/new', element: <NewAppointmentPage /> },
      { path: 'appointments/confirmation/:appointmentId', element: <AppointmentConfirmationPage /> },
      { path: 'appointments/:appointmentId', element: <AppointmentDetailsPage /> },
      {
        path: 'search',
        element: <PlaceholderPage title="Search visits" description="Find appointments using accessible search and filters." />,
      },
      {
        path: 'visit-actions',
        element: <PlaceholderPage title="Visit actions" description="Complete visit-related tasks and review their status." />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" description="Manage display, accessibility, privacy, and account preferences." />,
      },
      {
        path: 'help',
        element: <PlaceholderPage title="Help & shortcuts" description="Review help resources and keyboard shortcuts." />,
      },
    ],
  },
]);
