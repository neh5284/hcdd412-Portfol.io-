import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { SearchFilters } from '../components/SearchFilters';
import { Portfolio, Project } from '../data/mockData';
import {
  deleteProject,
  getCurrentPortfolio,
  regenerateShareLink,
  saveProject,
} from '../services/portfolioApi';
import {
  filterProjects,
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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
              : 'Dashboard data could not be loaded.',
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
      [portfolio?.projects],
  );

  const availableTags = useMemo(() => {
    return [
      ...new Set((portfolio?.projects || []).flatMap((project) => project.tags)),
    ].sort((a, b) => a.localeCompare(b));
  }, [portfolio?.projects]);

  const filteredProjects = useMemo(() => {
    return filterProjects(portfolio?.projects || [], {
      searchTerm,
      selectedCategory,
      selectedTag,
      selectedSource,
      verifiedOnly,
    });
  }, [
    portfolio?.projects,
    searchTerm,
    selectedCategory,
    selectedTag,
    selectedSource,
    verifiedOnly,
  ]);

  const sortedProjects = useMemo(() => {
    return sortProjectsByKey(filteredProjects, sortConfig.key, sortConfig.direction);
  }, [filteredProjects, sortConfig]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSelectedSource('all');
    setVerifiedOnly(false);
  };

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
              : 'Share link could not be regenerated.',
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
              : 'Project could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const shouldDelete = window.confirm(
        'Delete this project? This cannot be undone.',
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
              : 'Project could not be deleted.',
      );
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="border-2 border-black p-8 dark:border-white">
              <h1 className="text-2xl font-bold">Loading dashboard...</h1>
              <p className="mt-2 opacity-70">Fetching portfolio data...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error && !portfolio) {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="border-4 border-black p-10 dark:border-white">
              <h1 className="mb-3 text-3xl font-bold">Dashboard unavailable</h1>
              <p className="mb-6 opacity-70">{error}</p>
              <button
                  type="button"
                  onClick={loadPortfolioData}
                  className="border-2 border-black bg-black px-6 py-3 font-bold text-white dark:border-white dark:bg-white dark:text-black"
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
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="border-4 border-black bg-white p-8 dark:border-white dark:bg-neutral-900">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-wide opacity-60">
                    Dashboard
                  </p>
                  <h1 className="text-4xl font-bold">{portfolio.displayName}</h1>
                  <p className="mt-2 text-xl font-bold">{portfolio.title}</p>
                  <p className="mt-2 text-xl opacity-70">{portfolio.tagline}</p>
                  <p className="mt-4 max-w-2xl leading-relaxed opacity-80">
                    {portfolio.bio || 'Add a bio from your profile page.'}
                  </p>
                </div>

                <Link
                    to="/profile"
                    className="border-2 border-black px-4 py-2 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="flex flex-col gap-3 border-t-2 border-black pt-6 dark:border-white md:flex-row md:items-center">
                <div className="flex-1 overflow-x-auto border-2 border-black bg-gray-50 p-3 font-mono text-sm text-black dark:border-white dark:bg-neutral-800 dark:text-white">
                  {shareUrl || 'No share link available'}
                </div>

                <button
                    type="button"
                    onClick={handleCopyLink}
                    className="bg-black px-4 py-2 font-bold text-white dark:bg-white dark:text-black"
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </button>

                <button
                    type="button"
                    onClick={handleRegenerateShareLink}
                    className="border-2 border-black px-4 py-2 font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                >
                  Regenerate
                </button>
              </div>
            </section>

            <aside className="border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900">
              <h2 className="mb-4 text-xl font-bold">Stats</h2>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="border-2 border-black p-3 dark:border-white">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs uppercase opacity-60">Projects</div>
                </div>

                <div className="border-2 border-black p-3 dark:border-white">
                  <div className="text-2xl font-bold">{stats.verified}</div>
                  <div className="text-xs uppercase opacity-60">Verified</div>
                </div>

                <div className="border-2 border-black p-3 dark:border-white">
                  <div className="text-2xl font-bold">{stats.categories}</div>
                  <div className="text-xs uppercase opacity-60">Categories</div>
                </div>

                <div className="border-2 border-black p-3 dark:border-white">
                  <div className="text-2xl font-bold">{stats.groupProjects}</div>
                  <div className="text-xs uppercase opacity-60">Group</div>
                </div>
              </div>
            </aside>
          </div>

          {(error || notice) && (
              <div className="mb-8 border-2 border-black p-4 dark:border-white">
                <p className="font-bold">{error || notice}</p>
              </div>
          )}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Your Projects ({portfolio.projects.length})
              </h2>
              <p className="mt-1 opacity-70">
                Manage projects, narratives, verification, and visibility.
              </p>
            </div>

            <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsFormOpen(true);
                }}
                className="bg-black px-4 py-2 font-bold text-white dark:bg-white dark:text-black"
            >
              Add Project
            </button>
          </div>

          <SearchFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              selectedSource={selectedSource}
              verifiedOnly={verifiedOnly}
              availableTags={availableTags}
              resultCount={filteredProjects.length}
              onSearchTermChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onSourceChange={setSelectedSource}
              onVerifiedOnlyChange={setVerifiedOnly}
              onClear={clearFilters}
          />

          <div className="mb-6 flex flex-wrap gap-3">
            {(['title', 'createdAt', 'category'] as Array<keyof Project>).map((key) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => handleSort(key)}
                    className="border-2 border-black px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                >
                  Sort by {key === 'createdAt' ? 'date' : key}{' '}
                  {sortConfig.key === key ? sortConfig.direction : ''}
                </button>
            ))}
          </div>

          {sortedProjects.length === 0 ? (
              <div className="border-2 border-black p-12 text-center dark:border-white">
                <p className="text-xl opacity-70">No projects match the current filters.</p>
              </div>
          ) : (
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
          )}

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