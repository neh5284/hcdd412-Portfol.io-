import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  // bypassing the login check for now
  return <RouterProvider router={router} />;
}