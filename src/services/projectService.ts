import { api } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'down';
  lastDeploy: string;
  framework: 'react' | 'node' | 'python' | 'go';
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const projects = await api.get<Project[]>('/Projects');
    return projects.map(p => ({ ...p, id: p.id.toString() }));
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    try {
      const project = await api.get<Project>(`/Projects/${id}`);
      return { ...project, id: project.id.toString() };
    } catch (error) {
      return undefined;
    }
  },

  createProject: async (project: Omit<Project, 'id' | 'status' | 'lastDeploy'>): Promise<Project> => {
    const backendData = {
      name: project.name,
      description: project.description,
      framework: project.framework,
      status: 'healthy',
      lastDeploy: 'Just now'
    };

    const newProject = await api.post<any>('/Projects', backendData);
    return {
      id: newProject.id.toString(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status as Project['status'],
      lastDeploy: newProject.lastDeploy,
      framework: newProject.framework as Project['framework']
    };
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const updatedProject = await api.put<Project>(`/Projects/${id}`, updates);
    return { ...updatedProject, id: updatedProject.id.toString() };
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/Projects/${id}`);
  }
};
