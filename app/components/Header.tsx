import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getAuthUser, signOut } from '../services/authApi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', active: (pathname: string) => pathname === '/dashboard' },
  { to: '/portfolio/neh5284', label: 'Public View', active: (pathname: string) => pathname.startsWith('/portfolio/') || pathname.startsWith('/share/') },
  { to: '/profile', label: 'Profile', active: (pathname: string) => pathname === '/profile' },
  { to: '/settings', label: 'Settings', active: (pathname: string) => pathname === '/settings' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  const [authenticated, setAuthenticated] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const user = await getAuthUser();
        if (active) setAuthenticated(Boolean(user));
      } catch {
        if (active) setAuthenticated(false);
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      setAuthenticated(false);
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="border-b border-black bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight dark:text-white">
            portfol.io
          </Link>

          {!isLanding && (
            <div className="flex flex-wrap items-center gap-4 md:gap-6">

              {/* Authenticated Nav */}
              {authenticated &&
                navItems.map(({ to, label, active }) => {
                  const isActive = active(location.pathname);

                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`
                        rounded-full px-4 py-2 text-sm font-bold transition-all
                        ${isActive
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-black opacity-50 hover:opacity-100 dark:text-white'
                        }
                      `}
                    >
                      {label}
                    </Link>
                  );
                })}

              {/* Unauthenticated */}
              {!authenticated && (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-bold transition-opacity hover:opacity-100 dark:text-white ${
                      location.pathname === '/login' ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className={`
                      rounded-full border-2 border-black px-4 py-2 text-sm font-bold transition-all
                      bg-white text-black hover:bg-black hover:text-white
                      dark:border-white dark:bg-neutral-950 dark:text-white
                      dark:hover:bg-white dark:hover:text-black
                      ${location.pathname === '/signup' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}
                    `}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Logout */}
              {authenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    rounded-full border-2 border-black px-4 py-2 text-sm font-bold transition-all
                    bg-white text-black hover:bg-black hover:text-white
                    dark:border-white dark:bg-neutral-950 dark:text-white
                    dark:hover:bg-white dark:hover:text-black
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  {loggingOut ? 'Logging out...' : 'Log Out'}
                </button>
              )}

            </div>
          )}
        </div>
      </nav>
    </header>
  );
}