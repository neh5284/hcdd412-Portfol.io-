import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { Profile } from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'dashboard', Component: Dashboard },
      { path: 'profile', Component: Profile },
      { path: 'portfolio/:username', Component: PublicPortfolio },
      { path: 'share/:token', Component: PublicPortfolio },
    ],
  },
]);