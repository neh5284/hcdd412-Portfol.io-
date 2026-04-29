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
    <div className="mb-8 border-2 border-black bg-white p-6 dark:border-white dark:bg-neutral-900 dark:text-white">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-bold">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="w-full border-2 border-black bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:ring-white"
            placeholder="Search projects, tags, or narratives"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Category</label>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full border-2 border-black bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:ring-white"
          >
            <option value="all">All</option>
            <option value="coding">Coding</option>
            <option value="visual">Visual</option>
            <option value="design">Design</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Source</label>
          <select
            value={selectedSource}
            onChange={(event) => onSourceChange(event.target.value)}
            className="w-full border-2 border-black bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:ring-white"
          >
            <option value="all">All</option>
            <option value="github">GitHub</option>
            <option value="live">Live Link</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Tag</label>
          <select
            value={selectedTag}
            onChange={(event) => onTagChange(event.target.value)}
            className="w-full border-2 border-black bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-neutral-800 dark:text-white dark:focus:ring-white"
          >
            <option value="all">All</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t-2 border-black pt-4 dark:border-white md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-3 text-sm font-bold">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => onVerifiedOnlyChange(event.target.checked)}
            className="h-5 w-5 accent-black dark:accent-white"
          />
          Verified projects only
        </label>

        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{resultCount} result(s)</span>
          <button
            type="button"
            onClick={onClear}
            className="border-2 border-black px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}