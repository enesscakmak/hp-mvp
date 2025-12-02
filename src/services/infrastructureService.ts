import { api } from './api';

export interface InfrastructureConfig {
    id: number;
    key: string;
    value: string;
    category: string;
    projectId: number;
}

export const infrastructureService = {
    getByProject: async (projectId: number): Promise<InfrastructureConfig[]> => {
        const response = await api.get<InfrastructureConfig[]>(`/InfrastructureConfigs/project/${projectId}`);
        return response;
    },

    create: async (config: Omit<InfrastructureConfig, 'id'>): Promise<InfrastructureConfig> => {
        const response = await api.post<InfrastructureConfig>('/InfrastructureConfigs', config);
        return response;
    },

    update: async (id: number, config: InfrastructureConfig): Promise<void> => {
        await api.put(`/InfrastructureConfigs/${id}`, config);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/InfrastructureConfigs/${id}`);
    }
};
