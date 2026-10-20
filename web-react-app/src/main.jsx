import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './state/AuthContext';
import { AppointmentsProvider } from './state/AppointmentsContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppointmentsProvider>
        <RouterProvider router={router} />
      </AppointmentsProvider>
    </AuthProvider>
  </StrictMode>,
);
