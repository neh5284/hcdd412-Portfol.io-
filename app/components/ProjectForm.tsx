import { FormEvent, useState } from 'react';
import { Project } from '../data/mockData';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Partial<Project> & { narrativeContent?: string; isDraft?: boolean }) => void | Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'coding',
    tags: project?.tags.join(', ') || '',
    projectUrl: project?.projectUrl || '',
    githubUrl: project?.githubUrl || '',
    imageUrl: project?.imageUrl || '',
    isGroupProject: project?.isGroupProject || false,
    personalContribution: project?.personalContribution || '',
    isPublic: project?.isPublic ?? true,
    problem: project?.problem || '',
    process: project?.process || '',
    outcome: project?.outcome || '',
    role: project?.role || '',
    narrativeContent: project?.narrative || '',
    isDraft: project?.narrativeIsDraft || false,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSave({
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      {/* MODAL */}
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-neutral-700 bg-white p-8 dark:bg-neutral-900">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
          <button onClick={onCancel} className="text-sm underline dark:text-white">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* INPUT STYLE */}
          {/** Reusable input classes */}
          {/** (just mentally reuse this everywhere) */}

          {/* TITLE */}
          <div>
            <label className="mb-2 block text-sm font-bold dark:text-white">Project Title *</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              placeholder="Enter project title"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-bold dark:text-white">Short Description *</label>
            <input
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              placeholder="Brief one-line description"
            />
          </div>

          {/* GRID */}
          <div className="grid gap-6 md:grid-cols-2">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            >
              <option value="coding">Coding</option>
              <option value="visual">Visual</option>
              <option value="design">Design</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>

            <input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              placeholder="React, Supabase, TypeScript"
            />
          </div>

          {/* URLS */}
          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              placeholder="Project URL"
            />

            <input
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              placeholder="GitHub URL"
            />
          </div>

          {/* IMAGE */}
          <input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="Image URL"
          />

          {/* TEXTAREAS */}
          <textarea
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="Problem"
          />

          <textarea
            value={formData.process}
            onChange={(e) => setFormData({ ...formData, process: e.target.value })}
            className="w-full rounded-md border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="Process"
          />

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-neutral-500 px-6 py-3 font-bold dark:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-md bg-black px-6 py-3 font-bold text-white dark:bg-white dark:text-black"
            >
              {project ? 'Update Project' : 'Add Project'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}