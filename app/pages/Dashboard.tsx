import { useState } from 'react';
import { Plus, Copy, CheckCheck, Settings } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { mockUserPortfolio, Project } from '../data/mockData';

export function Dashboard() {
  const [portfolio, setPortfolio] = useState(mockUserPortfolio);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const shareUrl = `${window.location.origin}/portfolio/${portfolio.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      // Update existing project
      setPortfolio({
        ...portfolio,
        projects: portfolio.projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...projectData } : p
        ),
      });
    } else {
      // Add new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
      } as Project;
      setPortfolio({
        ...portfolio,
        projects: [newProject, ...portfolio.projects],
      });
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setPortfolio({
        ...portfolio,
        projects: portfolio.projects.filter((p) => p.id !== projectId),
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Profile Header */}
        <div className="mb-12 border-2 border-black p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-4xl font-bold">{portfolio.displayName}</h1>
              <p className="mb-4 text-xl opacity-70">{portfolio.tagline}</p>
              <p className="max-w-2xl leading-relaxed">{portfolio.bio}</p>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="ml-4 border-2 border-black bg-white p-3 transition-all hover:bg-black hover:text-white"
              aria-label="Edit profile"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          {/* Share Link */}
          <div className="flex items-center gap-3 border-t-2 border-black pt-6">
            <div className="flex-1 border-2 border-black bg-gray-50 p-3 font-mono text-sm">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              {copied ? (
                <>
                  <CheckCheck className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Your Projects ({portfolio.projects.length})</h2>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-bold text-white transition-all hover:bg-white hover:text-black"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        </div>

        {portfolio.projects.length === 0 ? (
          <div className="border-2 border-dashed border-black p-16 text-center">
            <p className="mb-4 text-xl opacity-70">No projects yet. Start building your portfolio!</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="border-2 border-black bg-black px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {portfolio.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {isFormOpen && (
        <ProjectForm
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
