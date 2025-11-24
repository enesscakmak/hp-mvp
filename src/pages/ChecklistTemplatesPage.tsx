import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckSquare,
    Plus,
    Search,
    Loader2,
    AlertTriangle,
    Rocket,
    MoreVertical,
    Trash2,
    Edit2,
    Copy,
    ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import CustomDropdown from '../components/CustomDropdown';
import CreateChecklistTemplateModal from '../components/CreateChecklistTemplateModal';
import {
    getChecklistTemplates,
    createChecklistTemplate,
    deleteChecklistTemplate,
    startChecklistRun,
    ChecklistTemplate
} from '../services/checklistService';
import { useNavigate } from 'react-router-dom';

const ChecklistTemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'deployment' | 'incident'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setIsLoading(true);
        const data = await getChecklistTemplates();
        setTemplates(data);
        setIsLoading(false);
    };

    const handleCreateTemplate = async (data: any) => {
        await createChecklistTemplate(data);
        await loadTemplates();
    };

    const handleStartRun = async (templateId: string) => {
        const run = await startChecklistRun(templateId);
        navigate(`/checklists/run/${run.id}`);
    };

    const handleDeleteTemplate = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            await deleteChecklistTemplate(id);
            await loadTemplates();
        }
    };

    const filteredTemplates = templates.filter(tmpl => {
        const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || tmpl.type === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Checklist Templates</h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            STANDARD_OPERATING_PROCEDURES
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-sm font-medium hover:bg-zinc-200 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Template</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <CustomDropdown
                            value={filterType}
                            onChange={(value) => setFilterType(value as any)}
                            options={[
                                { value: 'all', label: 'All Types' },
                                { value: 'deployment', label: 'Deployment' },
                                { value: 'incident', label: 'Incident' }
                            ]}
                            className="min-w-[160px]"
                        />
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-zinc-900/30 border border-zinc-800 rounded-sm p-6 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className={clsx("p-2 rounded-sm border",
                                    template.type === 'deployment' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                        "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                )}>
                                    {template.type === 'deployment' ? <Rocket className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{template.title}</h3>
                                    <span className="text-xs font-mono text-zinc-500 uppercase">{template.type}</span>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 mb-6 min-h-[40px] line-clamp-2">
                                {template.description}
                            </p>

                            <div className="space-y-3 mb-6">
                                {template.steps.slice(0, 3).map((step) => (
                                    <div key={step.id} className="flex items-center gap-2 text-sm text-zinc-500">
                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                                        <span className="truncate">{step.text}</span>
                                        {step.isOptional && <span className="text-xs text-zinc-600 italic ml-auto">(opt)</span>}
                                    </div>
                                ))}
                                {template.steps.length > 3 && (
                                    <div className="text-xs text-zinc-600 pl-3.5">
                                        + {template.steps.length - 3} more steps
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                                <span className="text-xs font-mono text-zinc-500">{template.steps.length} Steps</span>
                                <button
                                    onClick={() => handleStartRun(template.id)}
                                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                                >
                                    Start Run
                                    <ChevronRight className="h-3 w-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                        <CheckSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-500 font-mono">NO_TEMPLATES_FOUND</p>
                    </div>
                )}

            </div>

            <CreateChecklistTemplateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTemplate}
            />
        </div>
    );
};

export default ChecklistTemplatesPage;
