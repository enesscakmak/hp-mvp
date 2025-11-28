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
      framework: newProject.framework as Project['framework'],
      repoUrl: newProject.repoUrl
    };
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    // First get the current project to ensure we have all fields
    const currentProject = await projectService.getProjectById(id);
    if (!currentProject) {
      throw new Error('Project not found');
    }

    // Merge updates with current project
    const updatedData = {
      id: parseInt(id),
      name: updates.name ?? currentProject.name,
      description: updates.description ?? currentProject.description,
      status: currentProject.status,
      lastDeploy: currentProject.lastDeploy,
      framework: currentProject.framework,
      repoUrl: updates.repoUrl ?? currentProject.repoUrl
    };

    const result = await api.put<Project>(`/Projects/${id}`, updatedData);
    return { ...result, id: result.id.toString() };
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/Projects/${id}`);
  }
};
