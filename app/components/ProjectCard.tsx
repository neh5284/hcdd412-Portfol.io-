import { Project } from '../data/mockData';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  isPublic?: boolean;
  onTagClick?: (tag: string) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  isPublic = false,
  onTagClick,
}: ProjectCardProps) {
  const categoryColors = {
    coding: 'bg-black text-white dark:bg-white dark:text-black',
    visual:
      'bg-white text-black border-2 border-black dark:bg-neutral-800 dark:text-white dark:border-white',
    design:
      'bg-white text-black border-2 border-black dark:bg-neutral-800 dark:text-white dark:border-white',
    research:
      'bg-white text-black border-2 border-black dark:bg-neutral-800 dark:text-white dark:border-white',
    other: 'bg-gray-200 text-black dark:bg-neutral-700 dark:text-white',
  };

  const hasStructuredNarrative = Boolean(
    project.problem || project.process || project.outcome || project.role
  );

  return (
    <div className="group border-2 border-black bg-white p-6 text-black transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{project.title}</h3>

            {project.verified && (
              <span className="border border-black px-2 py-1 text-[11px] font-bold uppercase dark:border-white">
                Verified
              </span>
            )}

            {project.narrativeIsDraft && (
              <span className="border border-black px-2 py-1 text-[11px] font-bold uppercase dark:border-white">
                Draft Narrative
              </span>
            )}
          </div>

          <p className="mb-3 text-sm opacity-70">{project.description}</p>
        </div>

        <span
          className={`ml-4 whitespace-nowrap px-3 py-1 text-xs font-bold uppercase ${categoryColors[project.category]}`}
        >
          {project.category}
        </span>
      </div>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={`${project.title} preview`}
          className="mb-4 h-48 w-full border-2 border-black object-cover dark:border-white"
        />
      )}

      {hasStructuredNarrative ? (
        <div className="mb-4 space-y-3 text-sm leading-relaxed">
          {project.problem && (
            <section>
              <h4 className="font-bold uppercase">Problem</h4>
              <p>{project.problem}</p>
            </section>
          )}
          {project.process && (
            <section>
              <h4 className="font-bold uppercase">Process</h4>
              <p>{project.process}</p>
            </section>
          )}
          {project.outcome && (
            <section>
              <h4 className="font-bold uppercase">Outcome</h4>
              <p>{project.outcome}</p>
            </section>
          )}
          {project.role && (
            <section>
              <h4 className="font-bold uppercase">Role</h4>
              <p>{project.role}</p>
            </section>
          )}
        </div>
      ) : (
        <p className="mb-4 text-sm leading-relaxed">{project.narrative}</p>
      )}

      {project.isGroupProject && project.personalContribution && (
        <div className="mb-4 border-l-4 border-black bg-gray-50 p-4 dark:border-white dark:bg-neutral-800">
          <div className="mb-2 text-xs font-bold uppercase">
            Group Project - My Contribution
          </div>
          <p className="text-sm leading-relaxed">
            {project.personalContribution}
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagClick?.(tag)}
            className="border border-black px-2 py-1 text-xs transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-black pt-4 dark:border-white md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline transition-opacity hover:opacity-60"
            >
              Live Demo
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline transition-opacity hover:opacity-60"
            >
              GitHub
            </a>
          )}
        </div>

        {!isPublic && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="border border-black px-3 py-1 text-sm transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="border border-black px-3 py-1 text-sm transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}