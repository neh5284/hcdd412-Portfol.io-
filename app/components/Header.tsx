import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getSession, signOut } from '../services/authApi';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', active: (pathname: string) => pathname === '/dashboard' },
    { to: '/portfolio/neh5284', label: 'Public View', active: (pathname: string) => pathname.startsWith('/portfolio/') || pathname.startsWith('/share/') },
    { to: '/profile', label: 'Profile', active: (pathname: string) => pathname === '/profile' },
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
                const session = await getSession();

                if (active) {
                    setAuthenticated(Boolean(session));
                }
            } catch {
                if (active) {
                    setAuthenticated(false);
                }
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
        <header className="border-b border-black bg-white">
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

                            {!authenticated && (
                                <>
                                    <Link
                                        to="/login"
                                        className={`transition-opacity hover:opacity-60 ${location.pathname === '/login' ? 'opacity-100' : 'opacity-40'}`}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className={`rounded-full border-2 border-black px-4 py-2 transition-all hover:bg-black hover:text-white ${
                                            location.pathname === '/signup' ? 'bg-black text-white' : 'bg-white text-black'
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
                                    className="border-2 border-black bg-white px-4 py-2 font-bold transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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