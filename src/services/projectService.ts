

const API_URL = 'http://localhost:5069/api/projects';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'down';
  lastDeploy: string;
  framework: 'react' | 'node' | 'python' | 'go';
  repoUrl?: string;
  uptime?: string;
  errorRate?: string;
  avgLatency?: string;
  activeUsers?: string;

  // Infrastructure Info
  k8sNamespace?: string;
  k8sCluster?: string;
  serviceName?: string;
  ingressUrl?: string;

  // Wiki & Documentation
  wikiContent?: string;

  // Secrets & Config
  apiKey?: string;
  webhookSecret?: string;
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  getProjectById: async (id: string | number): Promise<Project | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  createProject: async (project: Omit<Project, 'id' | 'status' | 'lastDeploy'>): Promise<Project> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...project,
        status: 'healthy',
        lastDeploy: 'Unknown'
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  updateProject: async (id: string | number, updates: Partial<Project>): Promise<Project> => {
    // First get the current project
    const current = await projectService.getProjectById(id);
    if (!current) {
      throw new Error('Project not found');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...current,
        ...updates
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    // PUT returns NoContent, so return the updated project
    return { ...current, ...updates };
  },

  deleteProject: async (id: string | number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }
};
