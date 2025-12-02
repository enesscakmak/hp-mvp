import { api } from './api';

export interface EnvironmentVariable {
    id: number;
    key: string;
    value: string;
    projectId: number;
}

export const envVarService = {
    getByProject: async (projectId: number): Promise<EnvironmentVariable[]> => {
        const response = await api.get<EnvironmentVariable[]>(`/EnvironmentVariables/project/${projectId}`);
        return response;
    },

    create: async (envVar: Omit<EnvironmentVariable, 'id'>): Promise<EnvironmentVariable> => {
        const response = await api.post<EnvironmentVariable>('/EnvironmentVariables', envVar);
        return response;
    },

    update: async (id: number, envVar: EnvironmentVariable): Promise<void> => {
        await api.put(`/EnvironmentVariables/${id}`, envVar);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/EnvironmentVariables/${id}`);
    }
};
