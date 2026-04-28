import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ProjectCard } from '../components/ProjectCard';
import { SearchFilters } from '../components/SearchFilters';
import { Portfolio } from '../data/mockData';
import { getPortfolioByShareToken, getPortfolioByUsername } from '../services/portfolioApi';
import { filterProjects } from '../lib/portfolioUtils';
import { ProjectSorter, SortByDateStrategy } from '../strategies/projectSortStrategy';

export function PublicPortfolio() {
  const { username = '', token = '' } = useParams<{ username?: string; token?: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPortfolio = async () => {
      setLoading(true);
      setError('');

      try {
        const data = token
          ? await getPortfolioByShareToken(token)
          : await getPortfolioByUsername(username);
        if (active) setPortfolio(data);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Portfolio could not be loaded.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPortfolio();

    return () => {
      active = false;
    };
  }, [username, token]);

  const publicProjects = useMemo(() => {
    return (portfolio?.projects || []).filter(
      (project) => project.isPublic !== false
    );
  }, [portfolio?.projects]);

  const availableTags = useMemo(() => {
    return [
      ...new Set(publicProjects.flatMap((project) => project.tags)),
    ].sort((a, b) => a.localeCompare(b));
  }, [publicProjects]);

  const filteredProjects = useMemo(() => {
    return filterProjects(publicProjects, {
      searchTerm,
      selectedCategory,
      selectedTag,
      selectedSource,
      verifiedOnly,
    });
  }, [
    publicProjects,
    searchTerm,
    selectedCategory,
    selectedTag,
    selectedSource,
    verifiedOnly,
  ]);

  const sortedProjects = useMemo(() => {
    const sorter = new ProjectSorter(new SortByDateStrategy());
    return sorter.sort(filteredProjects);
  }, [filteredProjects]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSelectedSource('all');
    setVerifiedOnly(false);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="border-2 border-black dark:border-white p-8">
            <h1 className="text-2xl font-bold">Loading portfolio...</h1>
            <p className="mt-2 opacity-70">
              Fetching public portfolio data from Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="border-4 border-black dark:border-white p-10 text-center">
            <h1 className="mb-3 text-4xl font-bold">Portfolio not found</h1>
            <p className="mx-auto mb-8 max-w-2xl opacity-70">
              {error || 'This public portfolio is not available.'}
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center border-2 border-black dark:border-white bg-black dark:bg-white px-6 py-3 font-bold text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= PRIVATE =================
  if (portfolio.visibility === 'private') {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="border-4 border-black dark:border-white p-10 text-center">
            <h1 className="mb-3 text-4xl font-bold">
              This portfolio is private
            </h1>
            <p className="mx-auto mb-8 max-w-2xl opacity-70">
              The owner has not made this portfolio public.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-16 border-4 border-black dark:border-white bg-white dark:bg-neutral-900 p-12 text-center">
          <h1 className="mb-3 text-5xl font-bold">
            {portfolio.displayName}
          </h1>
          <p className="mb-2 text-2xl font-bold">
            {portfolio.title}
          </p>
          <p className="mb-6 text-2xl opacity-70">
            {portfolio.tagline}
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
            {portfolio.bio}
          </p>

          {portfolio.email && (
            <div className="flex justify-center">
              <a
                href={`mailto:${portfolio.email}`}
                className="border-2 border-black dark:border-white bg-black dark:bg-white px-6 py-3 font-bold text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
              >
                Get in Touch
              </a>
            </div>
          )}
        </div>

        {/* TITLE */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Projects</h2>
          <div className="mb-8 h-1 w-24 bg-black dark:bg-white" />
        </div>

        {/* FILTERS */}
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

        {/* PROJECT LIST */}
        {publicProjects.length === 0 ? (
          <div className="border-2 border-black dark:border-white p-16 text-center">
            <p className="text-xl opacity-70">
              No projects to display yet.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="border-2 border-black dark:border-white p-16 text-center">
            <p className="text-xl opacity-70">
              No projects match the current filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isPublic={true}
                onTagClick={setSelectedTag}
              />
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-16 border-t-2 border-black dark:border-white pt-8 text-center">
          <p className="mb-4 opacity-70">
            Want to create your own portfolio?
          </p>
          <Link
            to="/"
            className="border-2 border-black dark:border-white bg-white dark:bg-neutral-900 px-6 py-3 font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Build on portfol.io
          </Link>
        </div>
      </div>
    </div>
  );
}