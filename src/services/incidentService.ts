// Mock incident service for localStorage-based persistence

export interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    deploymentId?: string;
    projectId?: string;
    createdAt: string;
    resolvedAt?: string;
    assignedTo?: string;
}

const STORAGE_KEY = 'hp_incidents';

// Initialize with mock data if empty
const initializeIncidents = (): Incident[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    const initial: Incident[] = [
        {
            id: 'inc-1',
            title: 'High Error Rate in Auth Service',
            description: 'Spike in authentication failures after deployment',
            severity: 'critical',
            status: 'resolved',
            deploymentId: 'dep-1',
            projectId: 'proj-1',
            createdAt: '2h ago',
            resolvedAt: '1h ago',
            assignedTo: 'enes'
        },
        {
            id: 'inc-2',
            title: 'Payment Gateway Timeout',
            description: 'Users experiencing timeouts during checkout',
            severity: 'high',
            status: 'investigating',
            deploymentId: 'dep-3',
            projectId: 'proj-3',
            createdAt: '4h ago',
            assignedTo: 'alex'
        },
        {
            id: 'inc-3',
            title: 'Slow Dashboard Load Times',
            description: 'Dashboard taking 5+ seconds to load',
            severity: 'medium',
            status: 'open',
            deploymentId: 'dep-2',
            projectId: 'proj-2',
            createdAt: '30m ago',
            assignedTo: 'antigravity'
        },
        {
            id: 'inc-4',
            title: 'Database Connection Pool Exhausted',
            description: 'Connection pool hitting max capacity',
            severity: 'high',
            status: 'resolved',
            deploymentId: 'dep-4',
            projectId: 'proj-4',
            createdAt: '1d ago',
            resolvedAt: '20h ago',
            assignedTo: 'sarah'
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
};

export const getIncidents = async (): Promise<Incident[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return initializeIncidents();
};

export const getIncidentById = async (id: string): Promise<Incident | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const incidents = initializeIncidents();
    return incidents.find(i => i.id === id) || null;
};

export const getIncidentsByDeploymentId = async (deploymentId: string): Promise<Incident[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const incidents = initializeIncidents();
    return incidents.filter(i => i.deploymentId === deploymentId);
};

export const createIncident = async (data: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const incidents = initializeIncidents();
    const newIncident: Incident = {
        ...data,
        id: `inc-${Date.now()}`,
        createdAt: 'Just now'
    };

    incidents.unshift(newIncident);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));

    return newIncident;
};
