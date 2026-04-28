import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Portfolio } from '../data/mockData';
import { getCurrentPortfolio, ProfileUpdateInput, regenerateShareLink, updateProfile } from '../services/portfolioApi';

const emptyForm: ProfileUpdateInput = {
  displayName: '',
  title: '',
  username: '',
  tagline: '',
  bio: '',
  visibility: 'public',
};

export function Profile() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [form, setForm] = useState<ProfileUpdateInput>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const publicUrl = portfolio
    ? portfolio.shareToken
      ? `${window.location.origin}/share/${portfolio.shareToken}`
      : `${window.location.origin}/portfolio/${form.username || portfolio.username}`
    : '';

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getCurrentPortfolio();
      setPortfolio(data);
      setForm({
        displayName: data.displayName,
        title: data.title,
        username: data.username,
        tagline: data.tagline,
        bio: data.bio,
        visibility: data.visibility || 'public',
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Profile data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portfolio) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      await updateProfile(portfolio, form);
      setNotice('Profile updated.');
      await loadProfile();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Profile could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;

    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateShareLink = async () => {
    if (!portfolio) return;

    setError('');
    setNotice('');

    try {
      await regenerateShareLink(portfolio.id);
      setNotice('Share link regenerated.');
      await loadProfile();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Share link could not be regenerated.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="border-2 border-black p-8 dark:border-white">
            <h1 className="text-2xl font-bold">Loading profile...</h1>
            <p className="mt-2 opacity-70">Fetching profile data from Supabase.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="border-4 border-black p-10 dark:border-white">
            <h1 className="mb-3 text-3xl font-bold">Profile unavailable</h1>
            <p className="mb-6 opacity-70">{error}</p>
            <button
              type="button"
              onClick={loadProfile}
              className="border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/dashboard" className="mb-4 inline-flex font-bold opacity-70 transition-opacity hover:opacity-100">
              Back to dashboard
            </Link>
            <h1 className="text-4xl font-bold">Profile</h1>
            <p className="mt-2 opacity-70">Control the identity and intro shown on your public portfolio.</p>
          </div>

          <div className="border-2 border-black bg-black px-4 py-3 font-bold text-white dark:border-white dark:bg-white dark:text-black">
            Profile
          </div>
        </div>

        {(error || notice) && (
          <div className="mb-8 border-2 border-black p-4 dark:border-white">
            <p className="font-bold">{error || notice}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-8 dark:border-white dark:bg-neutral-900">
            <div className="mb-8 border-b-2 border-black pb-6 dark:border-white">
              <h2 className="text-2xl font-bold">Public details</h2>
              <p className="mt-2 opacity-70">These fields drive the dashboard and public portfolio.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold">Display Name *</label>
                <input
                  required
                  type="text"
                  value={form.displayName}
                  onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Portfolio Title *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Public Username *</label>
                <input
                  required
                  type="text"
                  value={form.username}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      username: event.target.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                    })
                  }
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Email</label>
                <input
                  disabled
                  type="email"
                  value={portfolio.email}
                  className="w-full border-2 border-black bg-gray-50 p-3 opacity-70 dark:border-white dark:bg-neutral-800 dark:text-gray-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  rows={7}
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Visibility</label>
                <select
                  value={form.visibility}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      visibility: event.target.value as ProfileUpdateInput['visibility'],
                    })
                  }
                  className="w-full border-2 border-black bg-white p-3 text-black dark:border-white dark:bg-neutral-800 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t-2 border-black pt-6 sm:flex-row dark:border-white">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>

              <Link
                to="/dashboard"
                className="inline-flex flex-1 items-center justify-center border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Cancel
              </Link>
            </div>
          </form>

          <aside className="space-y-8">
            <div className="border-2 border-black p-6 dark:border-white dark:bg-neutral-900">
              <h2 className="mb-4 text-xl font-bold">Preview</h2>

              <div className="border-2 border-black p-5 dark:border-white dark:bg-neutral-800">
                <h3 className="text-2xl font-bold">{form.displayName || 'Your Name'}</h3>
                <p className="mt-1 font-bold">{form.title || 'Portfolio Title'}</p>
                <p className="mt-2 opacity-70">{form.tagline || 'Your tagline'}</p>
                <p className="mt-4 text-sm leading-relaxed">{form.bio || 'Your bio will appear here.'}</p>
              </div>
            </div>

            <div className="border-2 border-black p-6 dark:border-white dark:bg-neutral-900">
              <h2 className="mb-4 text-xl font-bold">Public link</h2>

              <div className="mb-4 overflow-x-auto border-2 border-black bg-gray-50 p-3 font-mono text-sm dark:border-white dark:bg-neutral-800">
                {publicUrl}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex w-full items-center justify-center border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateShareLink}
                  className="inline-flex w-full items-center justify-center border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  Regenerate Link
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}