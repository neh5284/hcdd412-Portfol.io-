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
                      key={label}
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