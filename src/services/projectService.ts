import { Project } from '../components/ProjectCard';

const STORAGE_KEY = 'hp_mvp_projects';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'auth-service',
    description: 'Centralized authentication and authorization service handling JWT tokens and user sessions.',
    status: 'healthy',
    lastDeploy: '2h ago',
    framework: 'go',
  },
  {
    id: '2',
    name: 'payment-gateway',
    description: 'Stripe integration wrapper for processing recurring subscriptions and one-time payments.',
    status: 'warning',
    lastDeploy: '5m ago',
    framework: 'node',
  },
  {
    id: '3',
    name: 'frontend-dashboard',
    description: 'Main customer-facing dashboard built with React and Vite.',
    status: 'healthy',
    lastDeploy: '1d ago',
    framework: 'react',
  },
  {
    id: '4',
    name: 'data-pipeline',
    description: 'ETL pipeline for processing user analytics and generating daily reports.',
    status: 'down',
    lastDeploy: '3d ago',
    framework: 'python',
  },
  {
    id: '5',
    name: 'notification-worker',
    description: 'Background worker for sending emails and push notifications via SQS.',
    status: 'healthy',
    lastDeploy: '12h ago',
    framework: 'go',
  },
];

// Initialize storage with mock data if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return projects.find((p: Project) => p.id === id);
  },

  createProject: async (project: Omit<Project, 'id' | 'status' | 'lastDeploy'>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      status: 'healthy',
      lastDeploy: 'Just now',
    };

    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = projects.findIndex((p: Project) => p.id === id);

    if (index === -1) throw new Error('Project not found');

    const updatedProject = { ...projects[index], ...updates };
    projects[index] = updatedProject;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return updatedProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filteredProjects = projects.filter((p: Project) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  }
};
