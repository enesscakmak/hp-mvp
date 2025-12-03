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

export const getDeployments = async (): Promise<Deployment[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch deployments');
    }
    return response.json();
};

export const getDeploymentById = async (id: string): Promise<Deployment | undefined> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error('Failed to fetch deployment');
    }
    return response.json();
};

export const createDeployment = async (deployment: Omit<Deployment, 'id' | 'deployedAt' | 'status' | 'logsJson' | 'timelineJson'>): Promise<Deployment> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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
