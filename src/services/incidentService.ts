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


export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export const getIncidents = async (page = 1, pageSize = 10, deploymentId?: number, projectId?: number): Promise<PagedResult<Incident>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });
    if (deploymentId) params.append('deploymentId', deploymentId.toString());
    if (projectId) params.append('projectId', projectId.toString());

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
        throw new Error('Failed to fetch incidents');
    }
    return response.json();
};

export const getIncidentById = async (id: number | string): Promise<Incident | null> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    });
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch incident');
    }
    return response.json();
};

export const getIncidentsByDeploymentId = async (deploymentId: number | string): Promise<Incident[]> => {
    // Fetch all (or a large page) for now to maintain compatibility, or implement pagination in UI
    const result = await getIncidents(1, 100, Number(deploymentId));
    return result.items;
};

export const createIncident = async (data: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> => {
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

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
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
