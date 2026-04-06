import { Search, X } from 'lucide-react';
import { Project } from '../data/mockData';

interface SearchFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedTag: string;
  selectedSource: string;
  verifiedOnly: boolean;
  availableTags: string[];
  resultCount: number;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onVerifiedOnlyChange: (value: boolean) => void;
  onClear: () => void;
}

export function SearchFilters({
  searchTerm,
  selectedCategory,
  selectedTag,
  selectedSource,
  verifiedOnly,
  availableTags,
  resultCount,
  onSearchTermChange,
  onCategoryChange,
  onTagChange,
  onSourceChange,
  onVerifiedOnlyChange,
  onClear,
}: SearchFiltersProps) {
  return (
    <div className="mb-10 border-2 border-black bg-white p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold">Search Filters</h3>
          <p className="text-sm opacity-70">{resultCount} project{resultCount === 1 ? '' : 's'} shown</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 self-start border-2 border-black px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <label className="mb-2 block text-sm font-bold">Search</label>
          <div className="flex items-center gap-2 border-2 border-black px-3 py-3">
            <Search className="h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Title, description, or tag"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border-2 border-black bg-white p-3"
          >
            <option value="all">All categories</option>
            <option value="coding">Coding</option>
            <option value="visual">Visual</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full border-2 border-black bg-white p-3"
          >
            <option value="all">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Source</label>
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full border-2 border-black bg-white p-3"
          >
            <option value="all">All sources</option>
            <option value="github">GitHub</option>
            <option value="live">Live Demo</option>
            <option value="manual">Manual Entry</option>
          </select>
          <label className="mt-3 flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            Verified only
          </label>
        </div>
      </div>
    </div>
  );
}

export function matchesProjectSource(project: Project, source: string) {
  if (source === 'all') {
    return true;
  }

  if (source === 'github') {
    return Boolean(project.githubUrl);
  }

  if (source === 'live') {
    return Boolean(project.projectUrl);
  }

  return !project.githubUrl && !project.projectUrl;
}
