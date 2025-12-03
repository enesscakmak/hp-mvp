
import React, { useState, useEffect } from 'react';
import { ListChecks, Plus, Trash2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

import CustomDropdown from '../../../components/ui/CustomDropdown';
import { ChecklistStep, ChecklistTemplate } from '../../../services/checklistService';

interface CreateChecklistTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; type: 'deployment' | 'incident'; steps: ChecklistStep[] }) => void;
    initialData?: ChecklistTemplate | null;
}

const CreateChecklistTemplateModal: React.FC<CreateChecklistTemplateModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'deployment' | 'incident'>('deployment');
    const [steps, setSteps] = useState<ChecklistStep[]>([
        { id: '1', text: '', isOptional: false }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setType(initialData.type);
            setSteps(initialData.steps.length > 0 ? initialData.steps : [{ id: '1', text: '', isOptional: false }]);
        } else if (isOpen && !initialData) {
            // Reset form for create mode
            setTitle('');
            setDescription('');
            setType('deployment');
            setSteps([{ id: '1', text: '', isOptional: false }]);
        }
    }, [isOpen, initialData]);

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
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Checklist Template' : 'Create Checklist Template'}
            icon={<ListChecks className="h-5 w-5 text-emerald-400" />}
            size="lg"
        >
            <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Production Deployment"
                                required
                            />
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
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-400">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of when to use this checklist"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-4">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-zinc-400">Steps</label>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddStep}
                                    leftIcon={<Plus className="h-3 w-3" />}
                                >
                                    Add Step
                                </Button>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-start gap-2 group">
                                        <span className="text-zinc-600 text-xs font-mono mt-2.5 w-4">{index + 1}.</span>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                value={step.text}
                                                onChange={(e) => handleStepChange(step.id, 'text', e.target.value)}
                                                placeholder="Step description"
                                                required
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

                    <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            leftIcon={<ListChecks className="h-4 w-4" />}
                        >
                            {isSubmitting ? 'Saving...' : (initialData ? 'Update Template' : 'Create Template')}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateChecklistTemplateModal;
