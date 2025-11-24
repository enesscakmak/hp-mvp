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
