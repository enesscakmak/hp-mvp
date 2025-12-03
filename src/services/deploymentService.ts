export interface Deployment {
    id: number;
    projectName: string;
    version: string;
    environment: string;
    status: number;
    deployedAt: string;
    notes: string;
    commitHash: string;
    commitMessage: string;
    author: string;
    duration: string;
    branch: string;
    logsJson: string;
    timelineJson: string;
}

const API_URL = 'http://localhost:5069/api/deployments';

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export const getDeployments = async (page = 1, pageSize = 10, projectName?: string, environment?: string): Promise<PagedResult<Deployment>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    if (projectName) params.append('projectName', projectName);
    if (environment) params.append('environment', environment);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}?${params.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    });
    if (!response.ok) {
        throw new Error('Failed to fetch deployments');
    }
    return response.json();
};

export const getDeploymentById = async (id: string): Promise<Deployment | undefined> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    });
    if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error('Failed to fetch deployment');
    }
    return response.json();
};

export const createDeployment = async (deployment: Omit<Deployment, 'id' | 'deployedAt' | 'status' | 'logsJson' | 'timelineJson'>): Promise<Deployment> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            ...deployment,
            status: 0, // Pending
            deployedAt: new Date().toISOString(),
            logsJson: '[]',
            timelineJson: '[]'
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to create deployment');
    }
    return response.json();
};

export const rollback = async (id: number): Promise<Deployment> => {
    // 1. Get the target deployment to rollback to
    const targetDeployment = await getDeploymentById(id.toString());
    if (!targetDeployment) {
        throw new Error('Target deployment not found');
    }

    // 2. Create a new deployment based on the target
    // We append "(Rollback)" to the commit message to indicate it's a rollback
    return await createDeployment({
        projectName: targetDeployment.projectName,
        version: targetDeployment.version,
        environment: targetDeployment.environment,
        notes: `Rollback to version ${targetDeployment.version}`,
        commitHash: targetDeployment.commitHash,
        commitMessage: `[Rollback] ${targetDeployment.commitMessage}`,
        author: targetDeployment.author, // Or current user if we had auth context
        duration: '0s', // Reset duration
        branch: targetDeployment.branch
    });
};
