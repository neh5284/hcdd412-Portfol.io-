import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';
import { getAuthUser, signOut } from '../services/authApi';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type ThemePreference = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolioTheme';

function readTheme(): ThemePreference {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return 'light';
}

function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Remove old keys so they cannot override this setting later.
  localStorage.removeItem('darkMode');
  localStorage.removeItem('portfolioSettings');
}

export function Settings() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState<ThemePreference>('light');

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const hasUnsavedChanges = name.trim() !== originalName.trim();

  useEffect(() => {
    const savedTheme = readTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    void loadSettings();
  }, []);

  const handleThemeChange = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setNotice(`Theme changed to ${nextTheme}.`);
    setError('');
  };

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const authUser = await getAuthUser();

      if (!authUser) {
        throw new Error('You must be logged in to view settings.');
      }

      setUserId(authUser.id);
      setEmail(authUser.email || '');

      const userResult = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', authUser.id)
          .maybeSingle();

      if (userResult.error) {
        throw new Error(userResult.error.message || 'Account settings could not be loaded.');
      }

      if (userResult.data) {
        const loadedName = userResult.data.name || '';
        setName(loadedName);
        setOriginalName(loadedName);
        setEmail(userResult.data.email || authUser.email || '');
      } else {
        const fallbackName =
            typeof authUser.user_metadata?.name === 'string'
                ? authUser.user_metadata.name
                : authUser.email?.split('@')[0] || 'Portfolio Owner';

        const insertResult = await supabase
            .from('users')
            .insert([
              {
                id: authUser.id,
                name: fallbackName,
                email: authUser.email,
              },
            ])
            .select('id, name, email')
            .single();

        if (insertResult.error) {
          throw new Error(insertResult.error.message || 'Account profile could not be created.');
        }

        setName(insertResult.data.name || fallbackName);
        setOriginalName(insertResult.data.name || fallbackName);
        setEmail(insertResult.data.email || authUser.email || '');
      }

      const portfolioResult = await supabase
          .from('portfolios')
          .select('username')
          .eq('user_id', authUser.id)
          .maybeSingle();

      if (!portfolioResult.error && portfolioResult.data) {
        setUsername(portfolioResult.data.username || '');
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

  const handleSaveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedName = name.trim();

    if (!userId) {
      setError('User account is not available.');
      return;
    }

    if (!cleanedName) {
      setError('Name cannot be empty.');
      return;
    }

    setSaveStatus('saving');
    setError('');
    setNotice('');

    try {
      const result = await supabase
          .from('users')
          .update({
            name: cleanedName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

      if (result.error) {
        throw new Error(result.error.message || 'Settings could not be saved.');
      }

      setName(cleanedName);
      setOriginalName(cleanedName);
      setSaveStatus('saved');
      setNotice('Settings saved.');
    } catch (requestError) {
      setSaveStatus('error');
      setError(
          requestError instanceof Error
              ? requestError.message
              : 'Settings could not be saved.',
      );
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
                  className="border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
    );
  }

  const publicPortfolioUrl = username ? `/portfolio/${username}` : '';

  return (
      <div className="min-h-screen bg-white text-black transition-colors dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide opacity-60">
                Account
              </p>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="mt-2 opacity-70">
                Manage account details and theme.
              </p>
            </div>

            <Link
                to="/dashboard"
                className="border-2 border-black px-4 py-2 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            >
              Back to Dashboard
            </Link>
          </div>

          {(error || notice) && (
              <div className="mb-6 border-2 border-black p-4 dark:border-white">
                <p className="font-bold">{error || notice}</p>
              </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <main className="space-y-8">
              <form
                  onSubmit={handleSaveAccount}
                  className="border-4 border-black bg-white p-6 dark:border-white dark:bg-neutral-900"
              >
                <div className="mb-6 border-b-2 border-black pb-4 dark:border-white">
                  <h2 className="text-2xl font-bold">Account Details</h2>
                  <p className="mt-1 text-sm opacity-70">
                    Update your display name.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="settings-name" className="mb-2 block text-sm font-bold">
                      Name
                    </label>
                    <input
                        id="settings-name"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          setSaveStatus('idle');
                          setNotice('');
                          setError('');
                        }}
                        className="w-full border-2 border-black bg-white px-3 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-neutral-800 dark:text-white"
                        placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="settings-email" className="mb-2 block text-sm font-bold">
                      Email
                    </label>
                    <input
                        id="settings-email"
                        value={email}
                        disabled
                        className="w-full border-2 border-black bg-gray-100 px-3 py-3 text-black opacity-70 dark:border-white dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t-2 border-black pt-5 dark:border-white sm:flex-row sm:items-center">
                  <button
                      type="submit"
                      disabled={saveStatus === 'saving' || !hasUnsavedChanges}
                      className="border-2 border-black bg-black px-5 py-3 font-bold text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>

                  {hasUnsavedChanges && (
                      <button
                          type="button"
                          onClick={() => {
                            setName(originalName);
                            setSaveStatus('idle');
                            setError('');
                            setNotice('');
                          }}
                          className="border-2 border-black px-5 py-3 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                      >
                        Reset
                      </button>
                  )}
                </div>
              </form>

              <section className="border-4 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
                <div className="mb-6 border-b-2 border-black pb-4 dark:border-white">
                  <h2 className="text-2xl font-bold">Theme</h2>
                  <p className="mt-1 text-sm opacity-70">
                    Theme is saved in this browser.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`border-2 px-5 py-4 font-bold transition-all ${
                          theme === 'light'
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-black bg-white text-black hover:bg-black hover:text-white dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:bg-white dark:hover:text-black'
                      }`}
                  >
                    Light
                  </button>

                  <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`border-2 px-5 py-4 font-bold transition-all ${
                          theme === 'dark'
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-black bg-white text-black hover:bg-black hover:text-white dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:bg-white dark:hover:text-black'
                      }`}
                  >
                    Dark
                  </button>
                </div>
              </section>

              <section className="border-4 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
                <div className="mb-6 border-b-2 border-black pb-4 dark:border-white">
                  <h2 className="text-2xl font-bold">Session</h2>
                  <p className="mt-1 text-sm opacity-70">
                    End the current browser session.
                  </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="border-2 border-black bg-black px-5 py-3 font-bold text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
                >
                  Log Out
                </button>
              </section>
            </main>

            <aside className="space-y-6">
              <section className="border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
                <h2 className="mb-4 text-xl font-bold">Account Summary</h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-bold">Name</p>
                    <p className="break-words opacity-70">{name || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="font-bold">Email</p>
                    <p className="break-words opacity-70">{email || 'Not available'}</p>
                  </div>

                  <div>
                    <p className="font-bold">Theme</p>
                    <p className="capitalize opacity-70">{theme}</p>
                  </div>
                </div>
              </section>

              <section className="border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
                <h2 className="mb-4 text-xl font-bold">Portfolio Links</h2>

                <div className="flex flex-col gap-3">
                  <Link
                      to="/profile"
                      className="border-2 border-black px-4 py-2 text-center font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    Edit Public Profile
                  </Link>

                  <Link
                      to="/dashboard"
                      className="border-2 border-black px-4 py-2 text-center font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    Open Dashboard
                  </Link>

                  {publicPortfolioUrl && (
                      <Link
                          to={publicPortfolioUrl}
                          className="border-2 border-black px-4 py-2 text-center font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                      >
                        View Public Portfolio
                      </Link>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
  );
}

export default Settings;