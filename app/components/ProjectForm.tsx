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
      title: formData.title,
      description: formData.description,
      category: formData.category as Project['category'],
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      projectUrl: formData.projectUrl,
      githubUrl: formData.githubUrl,
      imageUrl: formData.imageUrl,
      isGroupProject: formData.isGroupProject,
      personalContribution: formData.personalContribution,
      isPublic: formData.isPublic,
      problem: formData.problem,
      process: formData.process,
      outcome: formData.outcome,
      role: formData.role,
      narrativeContent: formData.narrativeContent,
      isDraft: formData.isDraft,
    });
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border-4 border-black bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Add Project'}</h2>
            <button type="button" onClick={onCancel} className="font-bold underline">
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold">Project Title *</label>
              <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Short Description *</label>
              <input
                  required
                  type="text"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Brief one-line description"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">Category</label>
                <select
                    value={formData.category}
                    onChange={(event) =>
                        setFormData({
                          ...formData,
                          category: event.target.value as Project['category'],
                        })
                    }
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="coding">Coding</option>
                  <option value="visual">Visual</option>
                  <option value="design">Design</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Tags</label>
                <input
                    type="text"
                    value={formData.tags}
                    onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="React, Supabase, TypeScript"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">Project URL</label>
                <input
                    type="url"
                    value={formData.projectUrl}
                    onChange={(event) => setFormData({ ...formData, projectUrl: event.target.value })}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">GitHub URL</label>
                <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(event) => setFormData({ ...formData, githubUrl: event.target.value })}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Image URL</label>
              <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://example.com/image.png"
              />
            </div>

            <div className="border-2 border-black p-4">
              <label className="mb-3 flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={formData.isGroupProject}
                    onChange={(event) => setFormData({ ...formData, isGroupProject: event.target.checked })}
                    className="h-5 w-5 border-2 border-black accent-black"
                />
                <span className="text-sm font-bold">This is a group project</span>
              </label>

              {formData.isGroupProject && (
                  <div className="mt-4 border-t-2 border-black pt-4">
                    <label className="mb-2 block text-sm font-bold">Your Personal Contribution *</label>
                    <textarea
                        value={formData.personalContribution}
                        onChange={(event) => setFormData({ ...formData, personalContribution: event.target.value })}
                        rows={4}
                        className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Describe what you specifically contributed."
                        required={formData.isGroupProject}
                    />
                  </div>
              )}
            </div>

            <div className="border-2 border-black p-4">
              <h3 className="mb-4 text-xl font-bold">Structured Narrative</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Problem</label>
                  <textarea
                      value={formData.problem}
                      onChange={(event) => setFormData({ ...formData, problem: event.target.value })}
                      rows={4}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="What problem did this project solve?"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Process</label>
                  <textarea
                      value={formData.process}
                      onChange={(event) => setFormData({ ...formData, process: event.target.value })}
                      rows={4}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="How did you approach the work?"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Outcome</label>
                  <textarea
                      value={formData.outcome}
                      onChange={(event) => setFormData({ ...formData, outcome: event.target.value })}
                      rows={4}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="What was the result?"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Role</label>
                  <textarea
                      value={formData.role}
                      onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                      rows={4}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="What was your individual role?"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold">Full Narrative</label>
                <textarea
                    value={formData.narrativeContent}
                    onChange={(event) => setFormData({ ...formData, narrativeContent: event.target.value })}
                    rows={6}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Add a complete narrative or summary."
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-2 border-black p-4 md:flex-row md:items-center md:justify-between">
              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(event) => setFormData({ ...formData, isDraft: event.target.checked })}
                    className="h-5 w-5 accent-black"
                />
                Save narrative as draft
              </label>

              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(event) => setFormData({ ...formData, isPublic: event.target.checked })}
                    className="h-5 w-5 accent-black"
                />
                Show on public portfolio
              </label>
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