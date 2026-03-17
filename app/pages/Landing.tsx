import { Link } from 'react-router';
import { ArrowRight, Briefcase, Share2, FileText } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-black">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight">
              Your Work,
              <br />
              Your Story
            </h1>
            <p className="mb-8 text-xl opacity-70">
              Create a compelling portfolio that showcases your projects and opens doors to your future.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 border-2 border-black bg-black px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-black"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/portfolio/janesmth"
                className="border-2 border-black bg-white px-8 py-4 font-bold transition-all hover:bg-black hover:text-white"
              >
                View Example
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-black">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-16 text-center text-4xl font-bold">Built for Your Success</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-2 border-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 inline-block border-2 border-black bg-black p-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Showcase Your Work</h3>
              <p className="opacity-70">
                Display your coding projects, designs, and creative work in a professional, organized portfolio.
              </p>
            </div>

            <div className="border-2 border-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 inline-block border-2 border-black bg-black p-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Tell Your Story</h3>
              <p className="opacity-70">
                Add detailed narratives to each project, explaining your process, challenges, and achievements.
              </p>
            </div>

            <div className="border-2 border-black p-8 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 inline-block border-2 border-black bg-black p-4">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Share Instantly</h3>
              <p className="opacity-70">
                Get a shareable link to send to recruiters, colleges, or anyone you want to impress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="border-4 border-black bg-white p-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Ready to Stand Out?</h2>
            <p className="mb-8 text-xl opacity-70">
              Join students and professionals showcasing their best work.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 border-2 border-black bg-black px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-black"
            >
              Build Your Portfolio
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black bg-black py-8 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm">© 2026 portfol.io. Frontend skeleton - connect your own backend.</p>
        </div>
      </footer>
    </div>
  );
}
