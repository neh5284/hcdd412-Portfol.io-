import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signUpWithEmail } from '../services/authApi';

export function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('neh5284@psu.edu');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');
        setNotice('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setSubmitting(false);
            return;
        }

        try {
            const result = await signUpWithEmail({
                name,
                email,
                password,
            });

            if (result.session) {
                navigate('/dashboard', { replace: true });
                return;
            }

            setNotice('Account created. Check your email to confirm your account, then log in.');
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Signup failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-xl border-4 border-black bg-white p-8">
                    <p className="mb-3 text-sm font-bold uppercase tracking-wide opacity-60">
                        Create account
                    </p>

                    <h1 className="mb-3 text-4xl font-bold">Start your portfolio.</h1>
                    <p className="mb-8 opacity-70">
                        Create a Supabase account and the app will create your matching user profile and starter portfolio.
                    </p>

                    {error && (
                        <div className="mb-6 border-2 border-black p-4">
                            <p className="font-bold">Signup failed</p>
                            <p className="mt-1 text-sm opacity-70">{error}</p>
                        </div>
                    )}

                    {notice && (
                        <div className="mb-6 border-2 border-black bg-gray-50 p-4">
                            <p className="font-bold">{notice}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-bold">Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Your name"
                            />
                        </div>

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
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold">Confirm Password</label>
                            <input
                                required
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Repeat password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 border-t-2 border-black pt-6 text-sm">
                        <p className="opacity-70">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}