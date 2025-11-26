import { api } from './api';

export interface Deployment {
    id: string;
    project: string;
    environment: 'production' | 'staging' | 'preview';
    status: 'success' | 'failed' | 'building' | 'queued';
    commitHash: string;
    commitMessage: string;
    author: string;
    timestamp: string;
    duration: string;
    branch: string;
}

// Backend model mapping
interface BackendDeployment {
    id: number;
    projectName: string;
    version: string;
    environment: string;
    status: number; // 0=Pending, 1=Success, 2=Failed
    deployedAt: string;
    notes: string;
}

const mapBackendToFrontend = (backend: BackendDeployment): Deployment => {
    const statusMap: Record<number, Deployment['status']> = {
        0: 'queued',
        1: 'success',
        2: 'failed'
    };

    return {
        id: backend.id.toString(),
        project: backend.projectName,
        environment: backend.environment.toLowerCase() as Deployment['environment'],
        status: statusMap[backend.status] || 'queued',
        commitHash: backend.version.substring(0, 7),
        commitMessage: backend.notes || `Deploy ${backend.version}`,
        author: 'system',
        timestamp: new Date(backend.deployedAt).toLocaleString(),
        duration: backend.status === 1 ? '45s' : backend.status === 2 ? 'Failed' : 'Running...',
        branch: 'main'
    };
};

export const getDeployments = async (): Promise<Deployment[]> => {
    const deployments = await api.get<BackendDeployment[]>('/Deployments');
    return deployments.map(mapBackendToFrontend);
};

export const getDeploymentById = async (id: string): Promise<Deployment | null> => {
    try {
        const deployment = await api.get<BackendDeployment>(`/Deployments/${id}`);
        return mapBackendToFrontend(deployment);
    } catch (error) {
        return null;
    }
};

export const createDeployment = async (data: {
    project: string;
    branch: string;
    environment: 'production' | 'staging' | 'preview';
}): Promise<Deployment> => {
    const backendData = {
        projectName: data.project,
        version: `v1.0.0-${data.branch}`,
        environment: data.environment.charAt(0).toUpperCase() + data.environment.slice(1),
        status: 0, // Pending
        deployedAt: new Date().toISOString(),
        notes: `Deploy ${data.branch} to ${data.environment}`
    };

    const newDeployment = await api.post<BackendDeployment>('/Deployments', backendData);
    return mapBackendToFrontend(newDeployment);
};
