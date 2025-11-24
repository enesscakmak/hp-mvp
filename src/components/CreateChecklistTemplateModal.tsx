import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import CustomDropdown from './CustomDropdown';
import { ChecklistStep } from '../services/checklistService';

interface CreateChecklistTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; type: 'deployment' | 'incident'; steps: ChecklistStep[] }) => void;
}

const CreateChecklistTemplateModal: React.FC<CreateChecklistTemplateModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'deployment' | 'incident'>('deployment');
    const [steps, setSteps] = useState<ChecklistStep[]>([
        { id: '1', text: '', isOptional: false }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddStep = () => {
        setSteps([...steps, { id: Date.now().toString(), text: '', isOptional: false }]);
    };

    const handleRemoveStep = (id: string) => {
        if (steps.length > 1) {
            setSteps(steps.filter(s => s.id !== id));
        }
    };

    const handleStepChange = (id: string, field: keyof ChecklistStep, value: any) => {
        setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || steps.some(s => !s.text.trim())) return;

        setIsSubmitting(true);
        await onSubmit({
            title,
            description,
            type,
            steps: steps.filter(s => s.text.trim())
        });
        setIsSubmitting(false);

        // Reset form
        setTitle('');
        setDescription('');
        setType('deployment');
        setSteps([{ id: '1', text: '', isOptional: false }]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
                                    <CheckSquare className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Create Checklist Template</h2>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="create-template-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. Production Deployment"
                                                required
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                                            <CustomDropdown
                                                value={type}
                                                onChange={(val) => setType(val as any)}
                                                options={[
                                                    { value: 'deployment', label: 'Deployment' },
                                                    { value: 'incident', label: 'Incident' }
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Brief description of when to use this checklist"
                                                rows={3}
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-medium text-zinc-400">Steps</label>
                                            <button
                                                type="button"
                                                onClick={handleAddStep}
                                                className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Add Step
                                            </button>
                                        </div>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {steps.map((step, index) => (
                                                <div key={step.id} className="flex items-start gap-2 group">
                                                    <span className="text-zinc-600 text-xs font-mono mt-2.5 w-4">{index + 1}.</span>
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="text"
                                                            value={step.text}
                                                            onChange={(e) => handleStepChange(step.id, 'text', e.target.value)}
                                                            placeholder="Step description"
                                                            required
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
                                                        />
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={step.isOptional}
                                                                onChange={(e) => handleStepChange(step.id, 'isOptional', e.target.checked)}
                                                                className="rounded-sm border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                                                            />
                                                            <span className="text-xs text-zinc-500">Optional</span>
                                                        </label>
                                                    </div>
                                                    {steps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveStep(step.id)}
                                                            className="p-2 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-sm hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="create-template-form"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Template'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateChecklistTemplateModal;
