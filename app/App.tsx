import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  // We are bypassing the login check for now to focus on the
  // Sort by Column and Factory Method patterns.
  return <RouterProvider router={router} />;
}