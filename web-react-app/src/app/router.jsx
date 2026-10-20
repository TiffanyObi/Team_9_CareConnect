import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'appointments',
        element: <PlaceholderPage title="Appointments" description="Review upcoming and past appointments." />,
      },
      {
        path: 'appointments/new',
        element: <PlaceholderPage title="New appointment" description="Create and review a new appointment." />,
      },
      {
        path: 'appointments/:appointmentId',
        element: <PlaceholderPage title="Appointment details" description="Review visit details and available actions." />,
      },
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
