import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, ChevronRight, CheckCircle2, Circle, X } from 'lucide-react';
import { clsx } from 'clsx';
import {
    getChecklistRunsByTarget,
    getChecklistTemplates,
    startChecklistRun,
    ChecklistRun,
    ChecklistTemplate
} from '../services/checklistService';
import { toast } from 'sonner';

interface ChecklistSectionProps {
    targetId: string;
    targetType: 'deployment' | 'incident';
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ targetId, targetType }) => {
    const navigate = useNavigate();
    const [runs, setRuns] = useState<ChecklistRun[]>([]);
    const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [targetId]);

    const loadData = async () => {
        setIsLoading(true);
        const [runsData, templatesData] = await Promise.all([
            getChecklistRunsByTarget(targetId),
            getChecklistTemplates()
        ]);
        setRuns(runsData);
        // Filter templates by type
        setTemplates(templatesData.filter(t => t.type === targetType));
        setIsLoading(false);
    };

    const handleStartChecklist = async (templateId: string) => {
        const run = await startChecklistRun(templateId, targetId, targetType);
        toast.success('Checklist started');
        navigate(`/checklists/run/${run.id}`);
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-zinc-500" />
                    Checklists
                </h3>
                <button
                    onClick={() => setIsStartModalOpen(true)}
                    className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                    <Plus className="h-3 w-3" />
                    Start New
                </button>
            </div>

            <div className="space-y-3">
                {runs.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No active checklists.</p>
                ) : (
                    runs.map(run => (
                        <Link
                            key={run.id}
                            to={`/checklists/run/${run.id}`}
                            className="block p-3 bg-zinc-900 border border-zinc-800 rounded-sm hover:bg-zinc-800 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                                    {run.title}
                                </span>
                                {run.status === 'completed' ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <span className="text-xs font-mono text-zinc-500">{run.progress}%</span>
                                )}
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        "h-full rounded-full transition-all",
                                        run.status === 'completed' ? "bg-emerald-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${run.progress}%` }}
                                />
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Start Checklist Modal */}
            <AnimatePresence>
                {isStartModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsStartModalOpen(false)}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <h3 className="font-bold text-white">Start Checklist</h3>
                                <button onClick={() => setIsStartModalOpen(false)} className="text-zinc-500 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-2 max-h-[60vh] overflow-y-auto">
                                {templates.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-500">
                                        No templates found for {targetType}s.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {templates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleStartChecklist(template.id)}
                                                className="w-full text-left p-3 hover:bg-zinc-900 rounded-sm transition-colors group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-zinc-300 group-hover:text-white">
                                                        {template.title}
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                                    {template.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChecklistSection;
