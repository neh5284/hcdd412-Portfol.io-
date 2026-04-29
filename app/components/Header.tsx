import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getAuthUser, signOut } from '../services/authApi';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    active: (pathname: string) => pathname === '/dashboard',
  },
  {
    to: '/portfolio/neh5284',
    label: 'Public View',
    active: (pathname: string) =>
      pathname.startsWith('/portfolio/') || pathname.startsWith('/share/'),
  },
  {
    to: '/profile',
    label: 'Profile',
    active: (pathname: string) => pathname === '/profile',
  },
  {
    to: '/settings',
    label: 'Settings',
    active: (pathname: string) => pathname === '/settings',
  },
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
    <header className="border-b border-black bg-black text-white dark:border-white dark:bg-neutral-950">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            portfol.io
          </Link>

          {!isLanding && (
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {authenticated &&
                navItems.map(({ to, label, active }) => {
                  const isActive = active(location.pathname);

                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                        isActive
                          ? 'bg-white text-black'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}

              {!authenticated && (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                      location.pathname === '/login'
                        ? 'bg-white text-black'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                      location.pathname === '/signup'
                        ? 'bg-white text-black'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {authenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="px-4 py-2 text-sm font-bold rounded-full transition-all text-white/70 hover:text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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

export default Header;