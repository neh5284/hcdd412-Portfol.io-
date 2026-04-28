import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { Portfolio, Project } from '../data/mockData';
import {
  deleteProject,
  getCurrentPortfolio,
  regenerateShareLink,
  saveProject,
} from '../services/portfolioApi';
import {
  getPortfolioStats,
  sortProjectsByKey,
  SortDirection,
} from '../lib/portfolioUtils';

export function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: SortDirection;
  }>({
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
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Dashboard data could not be loaded.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPortfolioData();
  }, []);

  const stats = useMemo(
    () => getPortfolioStats(portfolio?.projects || []),
    [portfolio?.projects]
  );

  const sortedProjects = useMemo(() => {
    if (!portfolio) return [];
    return sortProjectsByKey(
      portfolio.projects,
      sortConfig.key,
      sortConfig.direction
    );
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
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Share link could not be regenerated.'
      );
    }
  };

  const handleSort = (key: keyof Project) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc'
          ? 'desc'
          : 'asc',
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
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Project could not be saved.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const shouldDelete = window.confirm(
      'Delete this project? This cannot be undone.'
    );
    if (!shouldDelete) return;

    setError('');
    setNotice('');

    try {
      await deleteProject(projectId);
      setNotice('Project deleted.');
      await loadPortfolioData();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Project could not be deleted.'
      );
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="border-2 border-black dark:border-white p-8">
            <h1 className="text-2xl font-bold">Loading dashboard...</h1>
            <p className="mt-2 opacity-70">
              Fetching portfolio data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="border-4 border-black dark:border-white p-10">
            <h1 className="mb-3 text-3xl font-bold">
              Dashboard unavailable
            </h1>
            <p className="mb-6 opacity-70">{error}</p>
            <button
              onClick={loadPortfolioData}
              className="border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-bold"
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
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* MAIN CARD */}
          <section className="border-4 border-black dark:border-white bg-white dark:bg-neutral-900 p-8">

            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                  {portfolio.displayName}
                </h1>
                <p className="text-xl opacity-70">
                  {portfolio.tagline}
                </p>
              </div>

              <Link
                to="/profile"
                className="border-2 border-black dark:border-white px-4 py-2"
              >
                Edit Profile
              </Link>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2"
              >
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              <button
                onClick={handleRegenerateShareLink}
                className="border px-4 py-2"
              >
                Regenerate
              </button>
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="border-2 border-black dark:border-white p-6 bg-white dark:bg-neutral-900">
            <h2 className="font-bold mb-2">Stats</h2>
            <p>Projects: {stats.total}</p>
            <p>Verified: {stats.verified}</p>
          </aside>
        </div>

        {/* PROJECTS */}
        <h2 className="text-3xl font-bold mb-6">
          Your Projects ({portfolio.projects.length})
        </h2>

        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 bg-black dark:bg-white text-white dark:text-black px-4 py-2"
        >
          Add Project
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>

        {isFormOpen && (
          <ProjectForm
            project={editingProject || undefined}
            onSave={handleSaveProject}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
}