import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { Portfolio, Project } from '../data/mockData';
import { deleteProject, getCurrentPortfolio, regenerateShareLink, saveProject } from '../services/portfolioApi';
import { getPortfolioStats, sortProjectsByKey, SortDirection } from '../lib/portfolioUtils';
export function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: SortDirection }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const shareUrl = portfolio
      ? portfolio.shareToken
          ? `${window.location.origin}/share/${portfolio.shareToken}`
          : `${window.location.origin}/portfolio/${portfolio.username}`
      : '';

  const loadPortfolioData = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getCurrentPortfolio();
      setPortfolio(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Dashboard data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPortfolioData();
  }, []);

  const stats = useMemo(() => getPortfolioStats(portfolio?.projects || []), [portfolio?.projects]);

  const sortedProjects = useMemo(() => {
    if (!portfolio) return [];
    return sortProjectsByKey(portfolio.projects, sortConfig.key, sortConfig.direction);
  }, [portfolio, sortConfig]);

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
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
      await loadPortfolioData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Share link could not be regenerated.');
    }
  };

  const handleSort = (key: keyof Project) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (!portfolio) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      await saveProject(portfolio.id, projectData, editingProject?.id);
      setNotice(editingProject ? 'Project updated.' : 'Project added.');
      setIsFormOpen(false);
      setEditingProject(null);
      await loadPortfolioData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Project could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const shouldDelete = window.confirm('Delete this project? This cannot be undone.');
    if (!shouldDelete) return;

    setError('');
    setNotice('');

    try {
      await deleteProject(projectId);
      setNotice('Project deleted.');
      await loadPortfolioData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Project could not be deleted.');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="border-2 border-black p-8">
              <h1 className="text-2xl font-bold">Loading dashboard...</h1>
              <p className="mt-2 opacity-70">Fetching portfolio, profile, project, narrative, and share-link data.</p>
            </div>
          </div>
        </div>
    );
  }

  if (error && !portfolio) {
    return (
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="border-4 border-black p-10">
              <h1 className="mb-3 text-3xl font-bold">Dashboard unavailable</h1>
              <p className="mb-6 opacity-70">{error}</p>
              <button
                  type="button"
                  onClick={loadPortfolioData}
                  className="border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
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
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="border-4 border-black bg-white p-8">
              <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-wide opacity-60">Dashboard</p>
                  <h1 className="mb-2 text-4xl font-bold">{portfolio.displayName}</h1>
                  <p className="mb-2 text-xl font-bold">{portfolio.title}</p>
                  <p className="mb-4 text-xl opacity-70">{portfolio.tagline}</p>
                  <p className="max-w-2xl leading-relaxed">{portfolio.bio || 'Add a bio from your profile page.'}</p>
                </div>

                <Link
                    to="/profile"
                    className="inline-flex items-center justify-center border-2 border-black bg-white px-5 py-3 font-bold transition-all hover:bg-black hover:text-white"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="flex flex-col gap-3 border-t-2 border-black pt-6 md:flex-row md:items-center">
                <div className="flex-1 overflow-x-auto border-2 border-black bg-gray-50 p-3 font-mono text-sm">
                  {shareUrl || 'No share link yet'}
                </div>

                <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </button>

                <button
                    type="button"
                    onClick={handleRegenerateShareLink}
                    className="inline-flex items-center justify-center border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white"
                >
                  Regenerate Link
                </button>

                <a
                    href={shareUrl}
                    className="inline-flex items-center justify-center border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white"
                >
                  View Public
                </a>
              </div>
            </section>

            <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-2 border-black p-6">
                <h2 className="mb-3 font-bold">Portfolio Stats</h2>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border-2 border-black p-3">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs uppercase opacity-60">Projects</div>
                  </div>

                  <div className="border-2 border-black p-3">
                    <div className="text-2xl font-bold">{stats.verified}</div>
                    <div className="text-xs uppercase opacity-60">Verified</div>
                  </div>

                  <div className="border-2 border-black p-3">
                    <div className="text-2xl font-bold">{stats.categories}</div>
                    <div className="text-xs uppercase opacity-60">Categories</div>
                  </div>

                  <div className="border-2 border-black p-3">
                    <div className="text-2xl font-bold">{stats.groupProjects}</div>
                    <div className="text-xs uppercase opacity-60">Group</div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-black p-6">
                <h2 className="mb-3 font-bold">Account</h2>
                <p className="break-all text-sm opacity-70">{portfolio.email}</p>
                <p className="mt-2 text-sm opacity-70">Public handle: @{portfolio.username}</p>
                <p className="mt-2 text-sm opacity-70">Visibility: {portfolio.visibility || 'public'}</p>
              </div>
            </aside>
          </div>

          {(error || notice) && (
              <div className="mb-8 border-2 border-black p-4">
                <p className="font-bold">{error || notice}</p>
              </div>
          )}

          <section>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Your Projects ({portfolio.projects.length})</h2>
                <p className="mt-1 opacity-70">Manage projects, narratives, verification status, and public visibility.</p>
              </div>

              <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsFormOpen(true);
                  }}
                  className="inline-flex items-center justify-center border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
              >
                Add Project
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {(['title', 'createdAt', 'category'] as Array<keyof Project>).map((key) => (
                  <button
                      key={key}
                      type="button"
                      onClick={() => handleSort(key)}
                      className="border-2 border-black px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white"
                  >
                    Sort by {key === 'createdAt' ? 'date' : key}{' '}
                    {sortConfig.key === key ? sortConfig.direction : ''}
                  </button>
              ))}
            </div>

            {sortedProjects.length === 0 ? (
                <div className="border-2 border-dashed border-black p-16 text-center">
                  <p className="mb-4 text-xl opacity-70">No projects yet. Start building your portfolio.</p>
                  <button
                      type="button"
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center justify-center border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
                  >
                    Add Your First Project
                  </button>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {sortedProjects.map((project) => (
                      <ProjectCard
                          key={project.id}
                          project={project}
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteProject(project.id)}
                      />
                  ))}
                </div>
            )}
          </section>

          {isFormOpen && (
              <ProjectForm
                  project={editingProject || undefined}
                  onSave={handleSaveProject}
                  onCancel={() => {
                    if (saving) return;
                    setIsFormOpen(false);
                    setEditingProject(null);
                  }}
              />
          )}
        </div>
      </div>
  );
}