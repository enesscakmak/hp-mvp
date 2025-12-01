export interface Incident {
    id: number;
    title: string;
    description: string;
    type: number; // 0=Bug, 1=Outage, 2=Maintenance, 3=Other
    severity: number; // 0=Low, 1=Medium, 2=High, 3=Critical
    status: number; // 0=Open, 1=InProgress, 2=Resolved, 3=Closed
    createdAt: string;
    resolvedAt?: string;
    assignedTo?: string;
    deploymentId?: number;
    projectId?: number;
}

const API_URL = 'http://localhost:5069/api/incidents';

// Helper to convert backend enum to frontend string
export const getSeverityString = (severity: number): 'low' | 'medium' | 'high' | 'critical' => {
    const map = ['low', 'medium', 'high', 'critical'] as const;
    return map[severity] || 'low';
};

export const getStatusString = (status: number): 'open' | 'investigating' | 'resolved' | 'closed' => {
    const map = ['open', 'investigating', 'resolved', 'closed'] as const;
    return map[status] || 'open';
};

// Helper to convert frontend string to backend enum
const getSeverityEnum = (severity: string): number => {
    const map: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
    return map[severity] || 0;
};

const getStatusEnum = (status: string): number => {
    const map: Record<string, number> = { open: 0, investigating: 1, resolved: 2, closed: 3 };
    return map[status] || 0;
};

export const getIncidents = async (): Promise<Incident[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch incidents');
    }
    return response.json();
};

export const getIncidentById = async (id: number | string): Promise<Incident | null> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch incident');
    }
    return response.json();
};

export const getIncidentsByDeploymentId = async (deploymentId: number | string): Promise<Incident[]> => {
    const incidents = await getIncidents();
    return incidents.filter(i => i.deploymentId?.toString() === deploymentId.toString());
};

export const createIncident = async (data: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            createdAt: new Date().toISOString()
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to create incident');
    }
    return response.json();
};

export const updateIncident = async (id: number | string, updates: Partial<Incident>): Promise<Incident> => {
    // First get the current incident
    const current = await getIncidentById(id);
    if (!current) {
        throw new Error('Incident not found');
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...current,
            ...updates
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update incident');
    }

    // PUT returns NoContent, so return the updated incident
    return { ...current, ...updates };
};

export const resolveIncident = async (id: number | string): Promise<Incident> => {
    return updateIncident(id, {
        status: 2, // Resolved
        resolvedAt: new Date().toISOString()
    });
};

export const closeIncident = async (id: number | string): Promise<Incident> => {
    return updateIncident(id, {
        status: 3 // Closed
    });
};

export const reassignIncident = async (id: number | string, assignedTo: string): Promise<Incident> => {
    return updateIncident(id, { assignedTo });
};
