import { api } from './api';

export interface ActivityMetadata {
    // Deployment metadata
    environment?: string;
    version?: string;
    projectName?: string;

    // Incident metadata
    severity?: number;
    incidentType?: number;
    assignedTo?: string;

    // Checklist metadata
    progress?: number;
    startedBy?: string;
    targetType?: string;
}

export interface Activity {
    type: 'deployment' | 'incident' | 'checklist';
    id: number;
    title: string;
    description: string;
    timestamp: string;
    status: number | string;
    metadata: ActivityMetadata;
}

export const activityService = {
    getActivityFeed: async (): Promise<Activity[]> => {
        const response = await api.get<Activity[]>('/activity/feed');
        return response;
    }
};
