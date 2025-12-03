import { api } from './api';

export interface ChecklistStep {
    id: string;
    text: string;
    isOptional: boolean;
}

export interface ChecklistTemplate {
    id: string;
    title: string;
    description: string;
    type: 'deployment' | 'incident';
    steps: ChecklistStep[];
    createdAt: string;
    updatedAt: string;
}

// Backend model mapping
interface BackendChecklistTemplate {
    id: number;
    title: string;
    description: string;
    type: string;
    stepsJson: string;
    createdAt: string;
    updatedAt: string;
}

const mapBackendTemplateToFrontend = (backend: BackendChecklistTemplate): ChecklistTemplate => {
    return {
        id: backend.id.toString(),
        title: backend.title,
        description: backend.description,
        type: backend.type as 'deployment' | 'incident',
        steps: JSON.parse(backend.stepsJson),
        createdAt: backend.createdAt,
        updatedAt: backend.updatedAt
    };
};

export const getChecklistTemplates = async (): Promise<ChecklistTemplate[]> => {
    const templates = await api.get<BackendChecklistTemplate[]>('/ChecklistTemplates');
    return templates.map(mapBackendTemplateToFrontend);
};

export const getChecklistTemplateById = async (id: string): Promise<ChecklistTemplate | undefined> => {
    try {
        const template = await api.get<BackendChecklistTemplate>(`/ChecklistTemplates/${id}`);
        return mapBackendTemplateToFrontend(template);
    } catch (error) {
        return undefined;
    }
};

export const createChecklistTemplate = async (data: Omit<ChecklistTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChecklistTemplate> => {
    const backendData = {
        title: data.title,
        description: data.description,
        type: data.type,
        stepsJson: JSON.stringify(data.steps)
    };

    const newTemplate = await api.post<BackendChecklistTemplate>('/ChecklistTemplates', backendData);
    return mapBackendTemplateToFrontend(newTemplate);
};

export const updateChecklistTemplate = async (id: string, updates: Partial<ChecklistTemplate>): Promise<ChecklistTemplate> => {
    const current = await getChecklistTemplateById(id);
    if (!current) throw new Error('Template not found');

    const backendData = {
        id: parseInt(id),
        title: updates.title || current.title,
        description: updates.description || current.description,
        type: updates.type || current.type,
        stepsJson: updates.steps ? JSON.stringify(updates.steps) : JSON.stringify(current.steps),
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
    };

    await api.put<BackendChecklistTemplate>(`/ChecklistTemplates/${id}`, backendData);
    // PUT returns 204 No Content usually, so we might need to fetch it again or return optimistic update
    // For now, let's assume we return the updated object or fetch it
    return { ...current, ...updates, updatedAt: new Date().toISOString() };
};

export const deleteChecklistTemplate = async (id: string): Promise<void> => {
    await api.delete(`/ChecklistTemplates/${id}`);
};

// Checklist Runs

export interface ChecklistRunStep {
    id: string;
    text: string;
    isOptional: boolean;
    isCompleted: boolean;
    completedAt?: string;
    completedBy?: string;
}

export interface ChecklistRun {
    id: string;
    templateId: string;
    title: string;
    status: 'active' | 'completed';
    steps: ChecklistRunStep[];
    progress: number;
    startedAt: string;
    completedAt?: string;
    startedBy: string;
    targetId?: string;
    targetType?: 'deployment' | 'incident';
}

interface BackendChecklistRun {
    id: number;
    templateId: number;
    title: string;
    status: string;
    stepsJson: string;
    progress: number;
    startedAt: string;
    completedAt?: string;
    startedBy: string;
    targetId?: number;
    targetType?: string;
}

const mapBackendRunToFrontend = (backend: BackendChecklistRun): ChecklistRun => {
    return {
        id: backend.id.toString(),
        templateId: backend.templateId.toString(),
        title: backend.title,
        status: backend.status as 'active' | 'completed',
        steps: JSON.parse(backend.stepsJson),
        progress: backend.progress,
        startedAt: backend.startedAt,
        completedAt: backend.completedAt,
        startedBy: backend.startedBy,
        targetId: backend.targetId?.toString(),
        targetType: backend.targetType as 'deployment' | 'incident' | undefined
    };
};

export const startChecklistRun = async (templateId: string, targetId?: string, targetType?: 'deployment' | 'incident'): Promise<ChecklistRun> => {
    const template = await getChecklistTemplateById(templateId);
    if (!template) throw new Error('Template not found');

    const steps = template.steps.map(s => ({
        ...s,
        isCompleted: false
    }));

    const backendData = {
        templateId: parseInt(templateId),
        title: template.title,
        status: 'active',
        stepsJson: JSON.stringify(steps),
        progress: 0,
        startedBy: 'enes', // Mock user
        targetId: targetId ? parseInt(targetId) : null,
        targetType: targetType
    };

    const newRun = await api.post<BackendChecklistRun>('/ChecklistRuns', backendData);
    return mapBackendRunToFrontend(newRun);
};

export const getChecklistRunsByTarget = async (targetId: string): Promise<ChecklistRun[]> => {
    const runs = await api.get<BackendChecklistRun[]>(`/ChecklistRuns/by-target/${targetId}`);
    return runs.map(mapBackendRunToFrontend);
};

export const getChecklistRunById = async (id: string): Promise<ChecklistRun | undefined> => {
    try {
        const run = await api.get<BackendChecklistRun>(`/ChecklistRuns/${id}`);
        return mapBackendRunToFrontend(run);
    } catch (error) {
        return undefined;
    }
};

export const toggleStepCompletion = async (runId: string, stepId: string, isCompleted: boolean): Promise<ChecklistRun> => {
    const current = await getChecklistRunById(runId);
    if (!current) throw new Error('Run not found');

    const updatedSteps = current.steps.map(s => {
        if (s.id === stepId) {
            return {
                ...s,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined,
                completedBy: isCompleted ? 'enes' : undefined
            };
        }
        return s;
    });

    const totalSteps = updatedSteps.length;
    const completedSteps = updatedSteps.filter(s => s.isCompleted).length;
    const progress = Math.round((completedSteps / totalSteps) * 100);

    const backendData = {
        id: parseInt(runId),
        templateId: parseInt(current.templateId),
        title: current.title,
        status: current.status,
        stepsJson: JSON.stringify(updatedSteps),
        progress: progress,
        startedAt: current.startedAt,
        startedBy: current.startedBy,
        targetId: current.targetId ? parseInt(current.targetId) : null,
        targetType: current.targetType
    };

    await api.put(`/ChecklistRuns/${runId}`, backendData);
    return { ...current, steps: updatedSteps, progress };
};

export const completeChecklistRun = async (runId: string): Promise<ChecklistRun> => {
    await api.put(`/ChecklistRuns/${runId}/complete`, {});
    const updated = await getChecklistRunById(runId);
    if (!updated) throw new Error('Failed to fetch updated run');
    return updated;
};
