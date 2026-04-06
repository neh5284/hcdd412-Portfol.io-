import { useEffect, useState } from 'react';
import { Plus, Copy, CheckCheck, Settings } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { Portfolio, Project } from '../data/mockData';
import { supabase } from '../supabaseClient';

export function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    id: '',
    userId: '',
    username: 'neh5284',
    displayName: 'Nathan Hinkle',
    bio: 'Human-Centered Design and Development student building a professional portfolio platform.',
    tagline: 'Building the future, one project at a time.',
    email: 'neh5284@psu.edu',
    projects: [],
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const shareUrl = `${window.location.origin}/portfolio/${portfolio.username}`;

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setLoading(true);
    console.log('Loading portfolio data...');

    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'neh5284@psu.edu')
        .single();

    console.log('usersData:', usersData);
    console.log('usersError:', usersError);

    if (usersError || !usersData) {
      console.error('Error loading user:', usersError);
      alert(`Error loading user: ${usersError?.message || 'User not found'}`);
      setLoading(false);
      return;
    }

    const { data: portfoliosData, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', usersData.id)
        .single();

    console.log('portfoliosData:', portfoliosData);
    console.log('portfoliosError:', portfoliosError);

    if (portfoliosError || !portfoliosData) {
      console.error('Error loading portfolio:', portfoliosError);
      alert(`Error loading portfolio: ${portfoliosError?.message || 'Portfolio not found'}`);
      setLoading(false);
      return;
    }

    const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('portfolio_id', portfoliosData.id)
        .order('created_at', { ascending: false });

    console.log('projectsData:', projectsData);
    console.log('projectsError:', projectsError);

    if (projectsError) {
      console.error('Error loading projects:', projectsError);
      alert(`Error loading projects: ${projectsError.message}`);
      setLoading(false);
      return;
    }

    const mappedProjects: Project[] = (projectsData || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      narrative: p.description || '',
      category: 'coding',
      tags: [],
      projectUrl: p.source_url || '',
      githubUrl: '',
      createdAt: p.created_at,
      isGroupProject: false,
      personalContribution: '',
    }));

    setPortfolio({
      id: portfoliosData.id,
      userId: usersData.id,
      username: 'neh5284',
      displayName: usersData.name || 'Nathan Hinkle',
      bio: portfoliosData.bio || '',
      tagline: 'Building the future, one project at a time.',
      email: usersData.email,
      projects: mappedProjects,
    });

    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    console.log('handleSaveProject called');
    console.log('portfolio.id:', portfolio.id);
    console.log('editingProject:', editingProject);
    console.log('projectData:', projectData);

    if (!portfolio.id) {
      alert('Portfolio ID is missing. Data may not have loaded yet.');
      return;
    }

    if (!projectData.title || !projectData.description) {
      alert('Please fill in the project title and description.');
      return;
    }

    if (editingProject) {
      const { error } = await supabase
          .from('projects')
          .update({
            title: projectData.title,
            description: projectData.description,
            source_url: projectData.projectUrl || null,
            status: 'published',
          })
          .eq('id', editingProject.id);

      if (error) {
        console.error('Error updating project:', error);
        alert(`Error updating project: ${error.message}`);
        return;
      }

      alert('Project updated successfully.');
    } else {
      const { error } = await supabase.from('projects').insert([
        {
          portfolio_id: portfolio.id,
          title: projectData.title,
          description: projectData.description,
          source_type: 'manual',
          source_url: projectData.projectUrl || null,
          status: 'published',
        },
      ]);

      if (error) {
        console.error('Error creating project:', error);
        alert(`Error creating project: ${error.message}`);
        return;
      }

      alert('Project created successfully.');
    }

    setIsFormOpen(false);
    setEditingProject(null);
    await loadPortfolioData();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        alert(`Error deleting project: ${error.message}`);
        return;
      }

      alert('Project deleted successfully.');
      await loadPortfolioData();
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  // --- DESIGN PATTERN: Sort by Column (Data Pattern) ---
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortData = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    // Toggle direction if the same column is clicked
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    // Direct manipulation of the project list currently in state
    const sortedProjects = [...portfolio.projects].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setPortfolio({ ...portfolio, projects: sortedProjects });
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-white p-10">
          <h1 className="text-2xl font-bold">Loading dashboard...</h1>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
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

          <div className="mb-8 flex items-center justify-between">
            <h2
                className="text-3xl font-bold cursor-pointer hover:underline select-none flex items-center gap-2"
                onClick={() => sortData('title')}
            >
              Your Projects ({portfolio.projects.length})
              <span className="text-xl opacity-50">
                  {sortConfig?.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
              </span>
            </h2>
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
              <div className="grid gap-8 md:grid-cols-2">
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
      </div>

  );
}