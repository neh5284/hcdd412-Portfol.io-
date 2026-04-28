import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { signInWithEmail } from '../services/authApi';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: string } | null)?.from || '/dashboard';

    const [email, setEmail] = useState('neh5284@psu.edu');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');

        try {
            await signInWithEmail({
                email,
                password,
            });

            navigate(from, { replace: true });
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Login failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-5xl border-4 border-black bg-white lg:grid-cols-[1fr_420px]">
                    <section className="border-b-4 border-black p-10 lg:border-b-0 lg:border-r-4">
                        <p className="mb-3 text-sm font-bold uppercase tracking-wide opacity-60">
                            Welcome back
                        </p>

                        <h1 className="mb-4 text-5xl font-bold leading-tight">
                            Log in to manage your portfolio.
                        </h1>

                        <p className="max-w-xl text-lg leading-relaxed opacity-70">
                            Access your dashboard, edit your profile, manage projects, update narratives, and regenerate public portfolio links.
                        </p>

                        <div className="mt-10 grid gap-4">
                            <div className="border-2 border-black p-4">
                                <h2 className="mb-1 font-bold">Dashboard</h2>
                                <p className="text-sm opacity-70">Add, edit, sort, and delete projects.</p>
                            </div>

                            <div className="border-2 border-black p-4">
                                <h2 className="mb-1 font-bold">Profile</h2>
                                <p className="text-sm opacity-70">Control your public name, username, bio, and tagline.</p>
                            </div>

                            <div className="border-2 border-black p-4">
                                <h2 className="mb-1 font-bold">Public Portfolio</h2>
                                <p className="text-sm opacity-70">Share your portfolio by username or secure share token.</p>
                            </div>
                        </div>
                    </section>

                    <section className="p-8">
                        <h2 className="mb-2 text-3xl font-bold">Login</h2>
                        <p className="mb-8 text-sm opacity-70">
                            Use your Supabase email and password.
                        </p>

                        {error && (
                            <div className="mb-6 border-2 border-black p-4">
                                <p className="font-bold">Login failed</p>
                                <p className="mt-1 text-sm opacity-70">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold">Password</label>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <label className="flex items-center gap-3 text-sm font-bold">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={(event) => setShowPassword(event.target.checked)}
                                    className="h-5 w-5 accent-black"
                                />
                                Show password
                            </label>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <div className="mt-8 border-t-2 border-black pt-6 text-sm">
                            <p className="opacity-70">
                                Do not have an account?{' '}
                                <Link to="/signup" className="font-bold underline">
                                    Create one
                                </Link>
                            </p>

                            <p className="mt-3 opacity-70">
                                Want to view the public example?{' '}
                                <Link to="/portfolio/neh5284" className="font-bold underline">
                                    Open public portfolio
                                </Link>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}