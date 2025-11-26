// Mock deployment service for localStorage-based persistence

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

const STORAGE_KEY = 'hp_deployments';

// Initialize with mock data if empty
const initializeDeployments = (): Deployment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    const initial: Deployment[] = [
        {
            id: 'dep-1',
            project: 'auth-service',
            environment: 'production',
            status: 'success',
            commitHash: 'a1b2c3d',
            commitMessage: 'feat: implement OIDC provider',
            author: 'enes',
            timestamp: '2h ago',
            duration: '45s',
            branch: 'main'
        },
        {
            id: 'dep-2',
            project: 'frontend-dashboard',
            environment: 'preview',
            status: 'building',
            commitHash: 'e5f6g7h',
            commitMessage: 'fix: modal positioning issue',
            author: 'antigravity',
            timestamp: 'Just now',
            duration: 'Running...',
            branch: 'fix/modal-position'
        },
        {
            id: 'dep-3',
            project: 'payment-gateway',
            environment: 'production',
            status: 'failed',
            commitHash: 'i8j9k0l',
            commitMessage: 'chore: update stripe api version',
            author: 'alex',
            timestamp: '5h ago',
            duration: '1m 20s',
            branch: 'main'
        },
        {
            id: 'dep-4',
            project: 'data-pipeline',
            environment: 'staging',
            status: 'success',
            commitHash: 'm1n2o3p',
            commitMessage: 'perf: optimize etl batch processing',
            author: 'sarah',
            timestamp: '1d ago',
            duration: '5m 12s',
            branch: 'main'
        },
        {
            id: 'dep-5',
            project: 'auth-service',
            environment: 'staging',
            status: 'success',
            commitHash: 'q4r5s6t',
            commitMessage: 'test: add integration tests for auth flow',
            author: 'enes',
            timestamp: '1d ago',
            duration: '3m 45s',
            branch: 'main'
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
};

export const getDeployments = async (): Promise<Deployment[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return initializeDeployments();
};

export const getDeploymentById = async (id: string): Promise<Deployment | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deployments = initializeDeployments();
    return deployments.find(d => d.id === id) || null;
};

export const createDeployment = async (data: {
    project: string;
    branch: string;
    environment: 'production' | 'staging' | 'preview';
}): Promise<Deployment> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const deployments = initializeDeployments();
    const newDeployment: Deployment = {
        id: `dep-${Date.now()}`,
        project: data.project,
        environment: data.environment,
        status: 'building',
        commitHash: Math.random().toString(36).substring(2, 9),
        commitMessage: `Deploy ${data.branch} to ${data.environment}`,
        author: 'current-user',
        timestamp: 'Just now',
        duration: 'Running...',
        branch: data.branch
    };

    deployments.unshift(newDeployment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deployments));

    return newDeployment;
};
