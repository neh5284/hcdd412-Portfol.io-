import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getAuthUser, signOut } from '../services/authApi';
import { getCurrentPortfolio } from '../services/portfolioApi';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  const [authenticated, setAuthenticated] = useState(false);
  const [publicPortfolioPath, setPublicPortfolioPath] = useState('/dashboard');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSessionAndPortfolio = async () => {
      try {
        const user = await getAuthUser();

        if (!active) return;

        setAuthenticated(Boolean(user));

        if (!user) {
          setPublicPortfolioPath('/dashboard');
          return;
        }

        try {
          const portfolio = await getCurrentPortfolio();

          if (!active) return;

          if (portfolio.username) {
            setPublicPortfolioPath(`/portfolio/${portfolio.username}`);
          } else if (portfolio.shareToken) {
            setPublicPortfolioPath(`/share/${portfolio.shareToken}`);
          } else {
            setPublicPortfolioPath('/dashboard');
          }
        } catch {
          if (!active) return;
          setPublicPortfolioPath('/dashboard');
        }
      } catch {
        if (!active) return;

        setAuthenticated(false);
        setPublicPortfolioPath('/dashboard');
      }
    };

    void loadSessionAndPortfolio();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      active: (pathname: string) => pathname === '/dashboard',
    },
    {
      to: publicPortfolioPath,
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

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      setAuthenticated(false);
      setPublicPortfolioPath('/dashboard');
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
      <header className="border-b border-black bg-white dark:border-white dark:bg-neutral-950 dark:text-white">
        <nav className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              portfol.io
            </Link>

            {!isLanding && (
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  {authenticated &&
                      navItems.map(({ to, label, active }) => {
                        const isActive = active(location.pathname);
                        const isPill = label === 'Profile' || label === 'Settings';

                        return (
                            <Link
                                key={label}
                                to={to}
                                className={
                                  isPill
                                      ? `rounded-full border-2 border-black px-4 py-2 transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black ${
                                          isActive
                                              ? 'bg-black text-white dark:bg-white dark:text-black'
                                              : 'bg-white text-black dark:bg-neutral-950 dark:text-white'
                                      }`
                                      : `transition-opacity hover:opacity-60 ${
                                          isActive ? 'opacity-100' : 'opacity-40'
                                      }`
                                }
                            >
                              {label}
                            </Link>
                        );
                      })}

                  {!authenticated && (
                      <>
                        <Link
                            to="/login"
                            className={`transition-opacity hover:opacity-60 ${
                                location.pathname === '/login' ? 'opacity-100' : 'opacity-40'
                            }`}
                        >
                          Login
                        </Link>

                        <Link
                            to="/signup"
                            className={`rounded-full border-2 border-black px-4 py-2 transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black ${
                                location.pathname === '/signup'
                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                    : 'bg-white text-black dark:bg-neutral-950 dark:text-white'
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
                          className="border-2 border-black bg-white px-4 py-2 font-bold transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:bg-white dark:hover:text-black"
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