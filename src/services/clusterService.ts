import { api } from './api';

export interface Cluster {
    id: number;
    name: string;
    region: string;
    description: string;
}

export const clusterService = {
    getAll: async (): Promise<Cluster[]> => {
        return await api.get<Cluster[]>('/Clusters');
    },

    getById: async (id: number): Promise<Cluster> => {
        return await api.get<Cluster>(`/Clusters/${id}`);
    }
};
