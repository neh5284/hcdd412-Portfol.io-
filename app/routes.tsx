import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PublicPortfolio } from './pages/PublicPortfolio';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'dashboard', Component: Dashboard },
      { path: 'portfolio/:username', Component: PublicPortfolio },
    ],
  },
]);
