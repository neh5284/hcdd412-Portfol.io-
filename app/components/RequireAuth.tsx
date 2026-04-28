import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { getAuthUser } from '../services/authApi';

interface RequireAuthProps {
    children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
    const location = useLocation();
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
                const user = await getAuthUser();

                if (!active) return;

                setStatus(user ? 'authenticated' : 'unauthenticated');
            } catch {
                if (!active) return;

                setStatus('unauthenticated');
            }
        };

        void checkSession();

        return () => {
            active = false;
        };
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <div className="border-2 border-black p-8">
                        <h1 className="text-2xl font-bold">Checking session...</h1>
                        <p className="mt-2 opacity-70">Loading authentication status.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}