import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { RequireAuth } from './components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      {
        path: 'dashboard',
        element: (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: (
            <RequireAuth>
              <Profile />
            </RequireAuth>
        ),
      },
      { path: 'portfolio/:username', Component: PublicPortfolio },
      { path: 'share/:token', Component: PublicPortfolio },
    ],
  },
]);