import { Link, useLocation } from 'react-router';
import { User, FolderOpen, Share2 } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header className="border-b border-black bg-white">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            portfol.io
          </Link>

          {!isLanding && (
            <div className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 transition-opacity hover:opacity-60 ${
                  location.pathname === '/dashboard' ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <FolderOpen className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/portfolio/johndoe"
                className={`flex items-center gap-2 transition-opacity hover:opacity-60 ${
                  location.pathname.startsWith('/portfolio/') ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <Share2 className="h-5 w-5" />
                <span>Public View</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 transition-all hover:bg-black hover:text-white"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
