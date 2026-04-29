import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';
import { getAuthUser, signOut } from '../services/authApi';

export function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // initialize from localStorage so it doesn’t reset
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void loadSettings();
  }, []);

  // single source of truth for dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const loadSettings = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getAuthUser();

      if (!user) {
        throw new Error('You must be logged in to view settings.');
      }

      setEmail(user.email || '');

      const userResult = await supabase
        .from('users')
        .select('name, email')
        .eq('id', user.id)
        .maybeSingle();

      if (userResult.error) {
        throw new Error(userResult.error.message || 'Settings could not be loaded.');
      }

      if (userResult.data) {
        setName(userResult.data.name || '');
        setEmail(userResult.data.email || user.email || '');
      } else {
        const fallbackName =
          typeof user.user_metadata?.name === 'string'
            ? user.user_metadata.name
            : user.email?.split('@')[0] || 'Portfolio Owner';

        const insertResult = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              name: fallbackName,
              email: user.email,
            },
          ])
          .select('name, email')
          .single();

        if (insertResult.error) {
          throw new Error(insertResult.error.message || 'Settings profile could not be created.');
        }

        setName(insertResult.data.name || '');
        setEmail(insertResult.data.email || user.email || '');
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Settings could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const user = await getAuthUser();

      if (!user) {
        throw new Error('You must be logged in to save settings.');
      }

      const result = await supabase
        .from('users')
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (result.error) {
        throw new Error(result.error.message || 'Settings could not be saved.');
      }

      setNotice('Settings saved.');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Settings could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="border-2 border-black p-8 dark:border-white">
            <h1 className="text-2xl font-bold">Loading settings...</h1>
            <p className="mt-2 opacity-70">Fetching account settings.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="border-4 border-black p-10 dark:border-white">
            <h1 className="mb-3 text-3xl font-bold">Settings unavailable</h1>
            <p className="mb-6 opacity-70">{error}</p>
            <button
              type="button"
              onClick={loadSettings}
              className="border-2 border-black bg-black px-6 py-3 font-bold text-white dark:border-white dark:bg-white dark:text-black"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Settings</h1>

        {(error || notice) && (
          <div className="mb-6 border-2 border-black p-4 dark:border-white">
            <p className="font-bold">{error || notice}</p>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="mb-6 border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900"
        >
          <h2 className="mb-4 text-xl font-bold">Account</h2>

          <div className="mb-4">
            <label htmlFor="settings-name" className="mb-2 block text-sm font-bold">
              Name
            </label>
            <input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border-2 border-black bg-white px-3 py-2 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="settings-email" className="mb-2 block text-sm font-bold">
              Email
            </label>
            <input
              id="settings-email"
              value={email}
              disabled
              className="w-full border-2 border-black bg-gray-100 px-3 py-2 text-black opacity-70 dark:border-white dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-black px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <section className="mb-6 border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
          <h2 className="mb-4 text-xl font-bold">Appearance</h2>

          <label className="flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) => setDarkMode(event.target.checked)}
              className="h-5 w-5 accent-black dark:accent-white"
            />
            Dark Mode
          </label>
        </section>

        <section className="border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
          <h2 className="mb-4 text-xl font-bold">Security</h2>

          <button
            type="button"
            onClick={handleLogout}
            className="border-2 border-black px-4 py-2 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Log Out
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;