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

const STORAGE_KEY = 'hp_checklist_templates';

const initializeTemplates = (): ChecklistTemplate[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    const initialTemplates: ChecklistTemplate[] = [
        {
            id: 'tmpl-1',
            title: 'Production Deployment',
            description: 'Standard checklist for production deployments',
            type: 'deployment',
            steps: [
                { id: 's1', text: 'Verify all tests passed', isOptional: false },
                { id: 's2', text: 'Check database migrations', isOptional: false },
                { id: 's3', text: 'Notify team in Slack', isOptional: true },
                { id: 's4', text: 'Monitor error rates', isOptional: false }
            ],
            createdAt: '2023-11-01T10:00:00Z',
            updatedAt: '2023-11-01T10:00:00Z'
        },
        {
            id: 'tmpl-2',
            title: 'Sev1 Incident Response',
            description: 'Critical incident response procedure',
            type: 'incident',
            steps: [
                { id: 's1', text: 'Acknowledge incident', isOptional: false },
                { id: 's2', text: 'Create war room', isOptional: false },
                { id: 's3', text: 'Assess impact', isOptional: false },
                { id: 's4', text: 'Update status page', isOptional: false }
            ],
            createdAt: '2023-11-05T14:30:00Z',
            updatedAt: '2023-11-05T14:30:00Z'
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTemplates));
    return initialTemplates;
};

export const getChecklistTemplates = async (): Promise<ChecklistTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return initializeTemplates();
};

export const getChecklistTemplateById = async (id: string): Promise<ChecklistTemplate | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const templates = initializeTemplates();
    return templates.find(t => t.id === id);
};

export const createChecklistTemplate = async (data: Omit<ChecklistTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChecklistTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const templates = initializeTemplates();
    const newTemplate: ChecklistTemplate = {
        ...data,
        id: `tmpl-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    templates.unshift(newTemplate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

    return newTemplate;
};

export const updateChecklistTemplate = async (id: string, updates: Partial<ChecklistTemplate>): Promise<ChecklistTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const templates = initializeTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) {
        throw new Error('Template not found');
    }

    templates[index] = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

    return templates[index];
};

export const deleteChecklistTemplate = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const templates = initializeTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
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
}

const RUNS_STORAGE_KEY = 'hp_checklist_runs';

const initializeRuns = (): ChecklistRun[] => {
    const stored = localStorage.getItem(RUNS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

export const startChecklistRun = async (templateId: string): Promise<ChecklistRun> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const template = await getChecklistTemplateById(templateId);
    if (!template) throw new Error('Template not found');

    const runs = initializeRuns();
    const newRun: ChecklistRun = {
        id: `run-${Date.now()}`,
        templateId: template.id,
        title: template.title,
        status: 'active',
        steps: template.steps.map(s => ({
            ...s,
            isCompleted: false
        })),
        progress: 0,
        startedAt: new Date().toISOString(),
        startedBy: 'enes' // Mock user
    };

    runs.unshift(newRun);
    localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));

    return newRun;
};

export const getChecklistRunById = async (id: string): Promise<ChecklistRun | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const runs = initializeRuns();
    return runs.find(r => r.id === id);
};

export const toggleStepCompletion = async (runId: string, stepId: string, isCompleted: boolean): Promise<ChecklistRun> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const runs = initializeRuns();
    const index = runs.findIndex(r => r.id === runId);

    if (index === -1) throw new Error('Run not found');

    const run = runs[index];
    const stepIndex = run.steps.findIndex(s => s.id === stepId);

    if (stepIndex === -1) throw new Error('Step not found');

    run.steps[stepIndex] = {
        ...run.steps[stepIndex],
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
        completedBy: isCompleted ? 'enes' : undefined
    };

    // Calculate progress
    const totalSteps = run.steps.length;
    const completedSteps = run.steps.filter(s => s.isCompleted).length;
    run.progress = Math.round((completedSteps / totalSteps) * 100);

    localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
    return run;
};

export const completeChecklistRun = async (runId: string): Promise<ChecklistRun> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const runs = initializeRuns();
    const index = runs.findIndex(r => r.id === runId);

    if (index === -1) throw new Error('Run not found');

    runs[index] = {
        ...runs[index],
        status: 'completed',
        completedAt: new Date().toISOString(),
        progress: 100
    };

    localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
    return runs[index];
};
