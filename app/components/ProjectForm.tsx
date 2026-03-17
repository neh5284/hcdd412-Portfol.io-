import { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '../data/mockData';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    narrative: project?.narrative || '',
    category: project?.category || 'coding',
    tags: project?.tags.join(', ') || '',
    projectUrl: project?.projectUrl || '',
    githubUrl: project?.githubUrl || '',
    isGroupProject: project?.isGroupProject || false,
    personalContribution: project?.personalContribution || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      category: formData.category as Project['category'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-4 border-black bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button
            onClick={onCancel}
            className="transition-opacity hover:opacity-60"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Short Description *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Brief one-line description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Project Narrative *</label>
            <textarea
              required
              value={formData.narrative}
              onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
              rows={6}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Tell the story of your project. What problem did it solve? What did you learn?"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="coding">Coding</option>
              <option value="visual">Visual</option>
              <option value="design">Design</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="React, Node.js, Design (comma-separated)"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Project URL</label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="border-2 border-black p-4">
            <label className="mb-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isGroupProject}
                onChange={(e) => setFormData({ ...formData, isGroupProject: e.target.checked })}
                className="h-5 w-5 border-2 border-black accent-black"
              />
              <span className="text-sm font-bold">This is a group project</span>
            </label>

            {formData.isGroupProject && (
              <div className="mt-4 border-t-2 border-black pt-4">
                <label className="mb-2 block text-sm font-bold">Your Personal Contribution *</label>
                <textarea
                  value={formData.personalContribution}
                  onChange={(e) => setFormData({ ...formData, personalContribution: e.target.value })}
                  rows={4}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Describe what you specifically contributed to this group project. What was your role? What features did you build?"
                  required={formData.isGroupProject}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 border-t-2 border-black pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border-2 border-black bg-white px-6 py-3 font-bold transition-all hover:bg-black hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              {project ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}