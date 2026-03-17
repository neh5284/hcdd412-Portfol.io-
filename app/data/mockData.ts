// Mock data structure - replace with your backend API calls

export interface Project {
  id: string;
  title: string;
  description: string;
  narrative: string;
  category: 'coding' | 'visual' | 'design' | 'other';
  tags: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  createdAt: string;
  isGroupProject?: boolean;
  personalContribution?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  tagline: string;
  email: string;
  projects: Project[];
}

// Mock current user portfolio
export const mockUserPortfolio: Portfolio = {
  id: 'user-1',
  userId: 'user-1',
  username: 'johndoe',
  displayName: 'John Doe',
  bio: 'Software Engineer & Designer passionate about creating meaningful digital experiences.',
  tagline: 'Building the future, one project at a time.',
  email: 'john.doe@email.com',
  projects: [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      narrative: 'Developed a comprehensive e-commerce platform that handles inventory management, payment processing, and user authentication. Built with scalability in mind, the platform supports thousands of concurrent users and implements best practices for security and performance optimization.',
      category: 'coding',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      projectUrl: 'https://example.com/ecommerce',
      githubUrl: 'https://github.com/johndoe/ecommerce',
      createdAt: '2025-12-15',
      isGroupProject: true,
      personalContribution: 'Led frontend development, architected the React component library, and implemented the shopping cart and checkout flow. Collaborated with two backend developers to integrate payment processing and real-time inventory updates.',
    },
    {
      id: 'proj-2',
      title: 'Brand Identity Design',
      description: 'Complete brand identity for a tech startup',
      narrative: 'Created a cohesive brand identity including logo design, color palette, typography system, and brand guidelines. The design reflects the company\'s innovative approach while maintaining professionalism and approachability.',
      category: 'visual',
      tags: ['Branding', 'Logo Design', 'Figma', 'Illustrator'],
      projectUrl: 'https://behance.net/project',
      createdAt: '2026-01-10',
    },
    {
      id: 'proj-3',
      title: 'Task Management App',
      description: 'Real-time collaborative task management application',
      narrative: 'Built a real-time task management application with WebSocket integration for live collaboration. Features include drag-and-drop task organization, team collaboration tools, and advanced filtering capabilities.',
      category: 'coding',
      tags: ['React', 'TypeScript', 'WebSocket', 'PostgreSQL'],
      githubUrl: 'https://github.com/johndoe/taskapp',
      createdAt: '2025-11-20',
    },
  ],
};

// Mock public portfolio (what someone would see when shared)
export const mockPublicPortfolio: Portfolio = {
  id: 'user-2',
  userId: 'user-2',
  username: 'janesmth',
  displayName: 'Jane Smith',
  bio: 'UX Designer & Frontend Developer specializing in accessible, user-centered design.',
  tagline: 'Designing with purpose and empathy.',
  email: 'jane.smith@email.com',
  projects: [
    {
      id: 'proj-4',
      title: 'Accessibility Dashboard',
      description: 'Analytics dashboard for web accessibility monitoring',
      narrative: 'Designed and developed a comprehensive accessibility monitoring dashboard that helps teams track and improve their web accessibility compliance. The tool automatically scans web pages and provides actionable insights.',
      category: 'coding',
      tags: ['React', 'D3.js', 'WCAG', 'Accessibility'],
      projectUrl: 'https://example.com/a11y-dashboard',
      createdAt: '2026-02-01',
    },
  ],
};