export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived';
    createdAt: string;
}

export interface Deployment {
    id: string;
    projectId: string;
    projectName: string;
    version: string;
    status: 'pending' | 'in_progress' | 'success' | 'failed';
    deployedAt: string;
}

export interface Incident {
    id: string;
    projectId: string;
    projectName: string;
    title: string;
    status: 'open' | 'resolved' | 'investigating';
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
}
