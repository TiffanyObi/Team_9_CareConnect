import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/AppProviders';
import { router } from './app/router';
import { PwaStatus } from './components/PwaStatus';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders><RouterProvider router={router} /><PwaStatus /></AppProviders>
  </StrictMode>,
);
