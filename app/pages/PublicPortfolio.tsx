import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Mail, ExternalLink } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { SearchFilters, matchesProjectSource } from '../components/SearchFilters';
import { mockUserPortfolio, mockPublicPortfolio } from '../data/mockData';
import { ProjectSorter, SortByDateStrategy} from '../strategies/projectSortStrategy';

export function PublicPortfolio() {
  const { username } = useParams<{ username: string }>();
  const portfolio = username === 'johndoe' ? mockUserPortfolio : mockPublicPortfolio;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const availableTags = useMemo(() => {
    return [...new Set(portfolio.projects.flatMap((project) => project.tags))].sort((a, b) => a.localeCompare(b));
  }, [portfolio.projects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return portfolio.projects.filter((project) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch) ||
        project.narrative.toLowerCase().includes(normalizedSearch) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);
      const matchesSource = matchesProjectSource(project, selectedSource);
      const matchesVerified = !verifiedOnly || Boolean(project.verified);

      return matchesSearch && matchesCategory && matchesTag && matchesSource && matchesVerified;
    });
  }, [portfolio.projects, searchTerm, selectedCategory, selectedTag, selectedSource, verifiedOnly]);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-16 border-4 border-black bg-white p-12 text-center">
          <h1 className="mb-3 text-5xl font-bold">{portfolio.displayName}</h1>
          <p className="mb-6 text-2xl opacity-70">{portfolio.tagline}</p>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed">{portfolio.bio}</p>

          <div className="flex items-center justify-center gap-4">
            <a
              href={`mailto:${portfolio.email}`}
              className="flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              <Mail className="h-5 w-5" />
              Get in Touch
            </a>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Projects</h2>
          <div className="mb-8 h-1 w-24 bg-black"></div>
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

        {portfolio.projects.length === 0 ? (
          <div className="border-2 border-black p-16 text-center">
            <p className="text-xl opacity-70">No projects to display yet.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="border-2 border-black p-16 text-center">
            <p className="text-xl opacity-70">No projects match the current filters.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isPublic={true} onTagClick={setSelectedTag} />
            ))} */}
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isPublic={true} onTagClick={setSelectedTag} />
            ))}
          </div>
        )}

        <div className="mt-16 border-t-2 border-black pt-8 text-center">
          <p className="mb-4 opacity-70">Want to create your own portfolio?</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white"
          >
            <ExternalLink className="h-5 w-5" />
            Build on portfol.io
          </a>
        </div>
      </div>
    </div>
  );
}
