import { useParams } from 'react-router';
import { Mail, ExternalLink } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { mockUserPortfolio, mockPublicPortfolio } from '../data/mockData';

export function PublicPortfolio() {
  const { username } = useParams<{ username: string }>();

  // In a real app, fetch portfolio data based on username
  // For now, use mock data based on username
  const portfolio = username === 'johndoe' ? mockUserPortfolio : mockPublicPortfolio;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Portfolio Header */}
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

        {/* Projects Grid */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Projects</h2>
          <div className="mb-8 h-1 w-24 bg-black"></div>
        </div>

        {portfolio.projects.length === 0 ? (
          <div className="border-2 border-black p-16 text-center">
            <p className="text-xl opacity-70">No projects to display yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {portfolio.projects.map((project) => (
              <ProjectCard key={project.id} project={project} isPublic={true} />
            ))}
          </div>
        )}

        {/* Footer */}
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
