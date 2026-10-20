import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AppointmentsProvider } from './state/AppointmentsContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppointmentsProvider>
      <RouterProvider router={router} />
    </AppointmentsProvider>
  </StrictMode>,
);
