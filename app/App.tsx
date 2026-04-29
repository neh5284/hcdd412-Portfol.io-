import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  useEffect(() => {
    const applyDarkMode = () => {
      const saved = localStorage.getItem('darkMode') === 'true';

      if (saved) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyDarkMode();

    window.addEventListener('darkModeChanged', applyDarkMode);

    return () => {
      window.removeEventListener('darkModeChanged', applyDarkMode);
    };
  }, []);

  return <RouterProvider router={router} />;
}