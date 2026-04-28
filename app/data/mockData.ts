export interface ProjectMedia {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  mimeType: string;
  altText?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  narrative: string;
  problem?: string;
  process?: string;
  outcome?: string;
  role?: string;
  narrativeIsDraft?: boolean;
  category: 'coding' | 'visual' | 'design' | 'research' | 'other';
  tags: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  createdAt: string;
  isGroupProject?: boolean;
  personalContribution?: string;
  verified?: boolean;
  isPublic?: boolean;
  verificationStatus?: string;
  verificationScore?: number;
  verificationFeedback?: string;
  media?: ProjectMedia[];
}

export interface Portfolio {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  title: string;
  bio: string;
  tagline: string;
  email: string;
  visibility?: 'public' | 'unlisted' | 'private';
  shareToken?: string;
  shareUrl?: string;
  projects: Project[];
}

export const mockPortfolio: Portfolio = {
  id: 'portfolio-1',
  userId: 'user-1',
  username: 'neh5284',
  displayName: 'Nathan Hinkle',
  title: 'Nathan Hinkle Portfolio',
  bio: 'Human-Centered Design and Development student focused on building clean, useful software.',
  tagline: 'Building the future, one project at a time.',
  email: 'neh5284@psu.edu',
  visibility: 'public',
  shareToken: 'sample-share-token',
  shareUrl: '/share/sample-share-token',
  projects: [
    {
      id: 'project-1',
      title: 'Portfol.io',
      description: 'A Supabase-backed portfolio platform for technical and creative work.',
      narrative: 'This project solves the problem of scattered portfolio content.',
      problem: 'Students need one place to present code, design, documents, and project context.',
      process: 'Built a dashboard, profile editor, public portfolio, and structured Supabase schema.',
      outcome: 'The result is a clearer portfolio system with shareable public pages.',
      role: 'Implemented core frontend and database integration.',
      category: 'coding',
      tags: ['React', 'Supabase', 'TypeScript'],
      projectUrl: 'https://example.com',
      githubUrl: 'https://github.com/neh5284/hcdd412-Portfol.io-',
      createdAt: '2026-02-01',
      isGroupProject: true,
      personalContribution: 'Built the dashboard, profile, public portfolio, and database integration.',
      verified: true,
      isPublic: true,
      verificationStatus: 'verified',
      verificationScore: 0.95,
    },
  ],
};