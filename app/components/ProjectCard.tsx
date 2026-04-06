import { Link } from 'react-router';
import { ExternalLink, Github, Calendar, Users, BadgeCheck } from 'lucide-react';
import { Project } from '../data/mockData';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  isPublic?: boolean;
}

export function ProjectCard({ project, onEdit, onDelete, isPublic = false }: ProjectCardProps) {
  const categoryColors = {
    coding: 'bg-black text-white',
    visual: 'bg-white text-black border-2 border-black',
    design: 'bg-white text-black border-2 border-black',
    other: 'bg-gray-200 text-black',
  };

  return (
    <div className="group border-2 border-black bg-white p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{project.title}</h3>
            {project.verified && (
              <span className="inline-flex items-center gap-1 border border-black px-2 py-1 text-[11px] font-bold uppercase">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <p className="mb-3 text-sm opacity-70">{project.description}</p>
        </div>
        <span className={`ml-4 whitespace-nowrap px-3 py-1 text-xs font-bold uppercase ${categoryColors[project.category]}`}>
          {project.category}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed">{project.narrative}</p>

      {project.isGroupProject && project.personalContribution && (
        <div className="mb-4 border-l-4 border-black bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Group Project - My Contribution</span>
          </div>
          <p className="text-sm leading-relaxed">{project.personalContribution}</p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="border border-black px-2 py-1 text-xs">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm underline transition-opacity hover:opacity-60"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm underline transition-opacity hover:opacity-60"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs opacity-50">
          <Calendar className="h-3 w-3" />
          {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>

      {!isPublic && (
        <div className="mt-4 flex gap-2 border-t-2 border-black pt-4 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex-1 border-2 border-black bg-white px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="border-2 border-black bg-white px-4 py-2 text-sm font-bold transition-all hover:bg-black hover:text-white"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
