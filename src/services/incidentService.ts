import { api } from './api';

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

// Backend model mapping
interface BackendIncident {
    id: number;
    title: string;
    description: string;
    type: number; // 0=Bug, 1=Outage, 2=Maintenance, 3=Other
    severity: number; // 0=Low, 1=Medium, 2=High, 3=Critical
    status: number; // 0=Open, 1=InProgress, 2=Resolved, 3=Closed
    createdAt: string;
    resolvedAt?: string;
}

const mapBackendToFrontend = (backend: BackendIncident): Incident => {
    const severityMap: Record<number, Incident['severity']> = {
        0: 'low',
        1: 'medium',
        2: 'high',
        3: 'critical'
    };

    const statusMap: Record<number, Incident['status']> = {
        0: 'open',
        1: 'investigating',
        2: 'resolved',
        3: 'closed'
    };

    return {
        id: backend.id.toString(),
        title: backend.title,
        description: backend.description,
        severity: severityMap[backend.severity] || 'low',
        status: statusMap[backend.status] || 'open',
        createdAt: new Date(backend.createdAt).toLocaleString(),
        resolvedAt: backend.resolvedAt ? new Date(backend.resolvedAt).toLocaleString() : undefined,
    };
};

export const getIncidents = async (): Promise<Incident[]> => {
    const incidents = await api.get<BackendIncident[]>('/Incidents');
    return incidents.map(mapBackendToFrontend);
};

export const getIncidentById = async (id: string): Promise<Incident | null> => {
    try {
        const incident = await api.get<BackendIncident>(`/Incidents/${id}`);
        return mapBackendToFrontend(incident);
    } catch (error) {
        return null;
    }
};

export const getIncidentsByDeploymentId = async (deploymentId: string): Promise<Incident[]> => {
    // Note: Backend doesn't have deployment relationship yet
    // For now, return all incidents
    const incidents = await getIncidents();
    return incidents.filter(i => i.deploymentId === deploymentId);
};

export const createIncident = async (data: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> => {
    const severityMap: Record<Incident['severity'], number> = {
        'low': 0,
        'medium': 1,
        'high': 2,
        'critical': 3
    };

    const statusMap: Record<Incident['status'], number> = {
        'open': 0,
        'investigating': 1,
        'resolved': 2,
        'closed': 3
    };

    const backendData = {
        title: data.title,
        description: data.description,
        type: 0, // Default to Bug
        severity: severityMap[data.severity],
        status: statusMap[data.status],
        createdAt: new Date().toISOString()
    };

    const newIncident = await api.post<BackendIncident>('/Incidents', backendData);
    return mapBackendToFrontend(newIncident);
};

export const updateIncident = async (id: string, updates: Partial<Incident>): Promise<Incident> => {
    const current = await getIncidentById(id);
    if (!current) throw new Error('Incident not found');

    const severityMap: Record<Incident['severity'], number> = {
        'low': 0,
        'medium': 1,
        'high': 2,
        'critical': 3
    };

    const statusMap: Record<Incident['status'], number> = {
        'open': 0,
        'investigating': 1,
        'resolved': 2,
        'closed': 3
    };

    const backendData = {
        id: parseInt(id),
        title: updates.title || current.title,
        description: updates.description || current.description,
        type: 0,
        severity: updates.severity ? severityMap[updates.severity] : severityMap[current.severity],
        status: updates.status ? statusMap[updates.status] : statusMap[current.status],
        createdAt: current.createdAt,
        resolvedAt: updates.resolvedAt || current.resolvedAt
    };

    const updatedIncident = await api.put<BackendIncident>(`/Incidents/${id}`, backendData);
    return mapBackendToFrontend(updatedIncident);
};

export const resolveIncident = async (id: string): Promise<Incident> => {
    return updateIncident(id, {
        status: 'resolved',
        resolvedAt: new Date().toISOString()
    });
};

export const closeIncident = async (id: string): Promise<Incident> => {
    return updateIncident(id, { status: 'closed' });
};

export const reassignIncident = async (id: string, assignedTo: string): Promise<Incident> => {
    return updateIncident(id, { assignedTo });
};
