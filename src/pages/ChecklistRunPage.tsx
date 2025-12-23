import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    Clock,
    User,
    CheckCircle2,
    Circle,
    AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import {
    getChecklistRunById,
    toggleStepCompletion,
    completeChecklistRun,
    ChecklistRun
} from '../services/checklistService';
import { toast } from 'sonner';

const ChecklistRunPage: React.FC = () => {
    const { runId } = useParams();
    const [run, setRun] = useState<ChecklistRun | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        if (runId) {
            loadRun(runId);
        }
    }, [runId]);

    const loadRun = async (id: string) => {
        setIsLoading(true);
        const data = await getChecklistRunById(id);
        setRun(data || null);
        setIsLoading(false);
    };

    const handleToggleStep = async (stepId: string, currentStatus: boolean) => {
        if (!run || run.status === 'completed') return;

        // Optimistic update
        const updatedSteps = run.steps.map(s =>
            s.id === stepId ? { ...s, isCompleted: !currentStatus } : s
        );
        const total = updatedSteps.length;
        const completed = updatedSteps.filter(s => s.isCompleted).length;
        const progress = Math.round((completed / total) * 100);

        setRun({ ...run, steps: updatedSteps, progress });

        // API call
        await toggleStepCompletion(run.id, stepId, !currentStatus);
    };

    const handleCompleteRun = async () => {
        if (!run) return;
        setIsCompleting(true);
        const updated = await completeChecklistRun(run.id);
        setRun(updated);
        toast.success('Checklist completed');
        setIsCompleting(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!run) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold mb-2">Checklist Run Not Found</h2>
                <Link to="/checklists" className="text-zinc-500 hover:text-white transition-colors">
                    Return to Templates
                </Link>
            </div>
        );
    }

    const allRequiredCompleted = run.steps.every(s => s.isOptional || s.isCompleted);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/checklists" className="hover:text-white transition-colors">Checklists</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">Run: {run.id}</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                                {run.title}
                                {run.status === 'completed' && (
                                    <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono uppercase">
                                        Completed
                                    </span>
                                )}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-zinc-500" />
                                    <span>Started {new Date(run.startedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-zinc-500" />
                                    <span>{run.startedBy}</span>
                                </div>
                            </div>
                        </div>

                        {run.status === 'active' && (
                            <button
                                onClick={handleCompleteRun}
                                disabled={!allRequiredCompleted || isCompleting}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2 rounded-sm font-medium transition-all",
                                    allRequiredCompleted
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                )}
                            >
                                {isCompleting ? (
                                    <Clock className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                <span>Complete Checklist</span>
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-zinc-400 font-mono">Progress</span>
                            <span className="text-white font-mono">{run.progress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${run.progress}% ` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={clsx(
                                    "h-full rounded-full transition-colors",
                                    run.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps List */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-3">
                    {run.steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleToggleStep(step.id, step.isCompleted)}
                            className={clsx(
                                "group p-4 rounded-sm border transition-all cursor-pointer select-none",
                                step.isCompleted
                                    ? "bg-zinc-900/30 border-zinc-800 opacity-75"
                                    : "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={clsx(
                                    "mt-0.5 flex-shrink-0 transition-colors",
                                    step.isCompleted ? "text-emerald-500" : "text-zinc-600 group-hover:text-zinc-500"
                                )}>
                                    {step.isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                    ) : (
                                        <Circle className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={clsx(
                                            "font-medium transition-colors",
                                            step.isCompleted ? "text-zinc-500 line-through" : "text-white"
                                        )}>
                                            {step.text}
                                        </span>
                                        {step.isOptional && (
                                            <span className="text-xs px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-500 font-mono uppercase">
                                                Optional
                                            </span>
                                        )}
                                    </div>
                                    {step.completedBy && (
                                        <p className="text-xs text-zinc-600 font-mono">
                                            Completed by {step.completedBy} at {new Date(step.completedAt!).toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {!allRequiredCompleted && run.status === 'active' && (
                    <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-sm flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-400">Action Required</h3>
                            <p className="text-sm text-blue-500/70 mt-1">
                                Complete all required steps to finish this checklist run.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChecklistRunPage;
