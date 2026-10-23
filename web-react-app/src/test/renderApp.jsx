import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '../app/AppProviders';
import { appRoutes } from '../app/router';

export function renderApp(initialEntry = '/') {
  const router = createMemoryRouter(appRoutes, { initialEntries: [initialEntry] });
  return {
    router,
    ...render(<AppProviders><RouterProvider router={router} /></AppProviders>),
  };
}
