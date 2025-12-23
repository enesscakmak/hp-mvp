import { api } from './api';

export interface ResourceAttribute {
    id: number;
    key: string;
    value: string;
    resourceId: number;
}

export interface ProjectResource {
    id: number;
    name: string;
    type: string;
    description?: string;
    projectId: number;
    attributes: ResourceAttribute[];
}

export const resourceService = {
    getByProject: async (projectId: number): Promise<ProjectResource[]> => {
        return await api.get<ProjectResource[]>(`/ProjectResources/project/${projectId}`);
    },

    create: async (resource: Omit<ProjectResource, 'id' | 'attributes'>): Promise<ProjectResource> => {
        return await api.post<ProjectResource>('/ProjectResources', resource);
    },

    update: async (id: number, resource: Partial<ProjectResource>): Promise<void> => {
        await api.put(`/ProjectResources/${id}`, resource);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/ProjectResources/${id}`);
    },

    addAttribute: async (resourceId: number, attribute: Omit<ResourceAttribute, 'id' | 'resourceId'>): Promise<ResourceAttribute> => {
        return await api.post<ResourceAttribute>(`/ProjectResources/${resourceId}/attributes`, { ...attribute, resourceId });
    },

    deleteAttribute: async (id: number): Promise<void> => {
        await api.delete(`/ProjectResources/attributes/${id}`);
    }
};
