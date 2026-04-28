import { Link, useLocation } from 'react-router';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', active: (pathname: string) => pathname === '/dashboard' },
  { to: '/portfolio/neh5284', label: 'Public View', active: (pathname: string) => pathname.startsWith('/portfolio/') || pathname.startsWith('/share/') },
  { to: '/profile', label: 'Profile', active: (pathname: string) => pathname === '/profile' },
];

export function Header() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
      <header className="border-b border-black bg-white">
        <nav className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              portfol.io
            </Link>

            {!isLanding && (
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  {navItems.map(({ to, label, active }) => {
                    const isActive = active(location.pathname);
                    const isProfile = label === 'Profile';

                    return (
                        <Link
                            key={to}
                            to={to}
                            className={
                              isProfile
                                  ? `rounded-full border-2 border-black px-4 py-2 transition-all hover:bg-black hover:text-white ${
                                      isActive ? 'bg-black text-white' : 'bg-white text-black'
                                  }`
                                  : `transition-opacity hover:opacity-60 ${isActive ? 'opacity-100' : 'opacity-40'}`
                            }
                        >
                          {label}
                        </Link>
                    );
                  })}
                </div>
            )}
          </div>
        </nav>
      </header>
  );
}