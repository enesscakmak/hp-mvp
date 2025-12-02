import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { createIncident } from '../services/incidentService';
import { projectService } from '../services/projectService';
import CustomDropdown from './CustomDropdown';
import { toast } from 'sonner';

interface CreateIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 0, // Bug
        severity: 0, // Low
        projectId: null as number | null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadProjects();
        }
    }, [isOpen]);

    const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
            toast.error('Failed to load projects');
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createIncident({
                title: formData.title,
                description: formData.description,
                type: formData.type,
                severity: formData.severity,
                status: 0, // Open
                projectId: formData.projectId ?? undefined,
                assignedTo: undefined,
                deploymentId: undefined
            });
            setIsLoading(false);
            toast.success('Incident reported successfully');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                type: 0,
                severity: 0,
                projectId: null
            });
        } catch (err) {
            toast.error('Failed to report incident');
            setIsLoading(false);
        }
    };

    const projectOptions = [
        { value: '', label: 'None (General)' },
        ...projects.map(p => ({ value: p.id.toString(), label: p.name }))
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
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
                            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-sm">
                                            <AlertTriangle className="h-5 w-5 text-rose-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Report Incident</h2>
                                    </div>
                                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                                            placeholder="Brief description of the incident"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px]"
                                            placeholder="Detailed description of what happened"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Severity</label>
                                        <CustomDropdown
                                            value={formData.severity.toString()}
                                            onChange={(value) => setFormData({ ...formData, severity: parseInt(value) })}
                                            options={[
                                                { value: '0', label: 'Low' },
                                                { value: '1', label: 'Medium' },
                                                { value: '2', label: 'High' },
                                                { value: '3', label: 'Critical' }
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                                        <CustomDropdown
                                            value={formData.type.toString()}
                                            onChange={(value) => setFormData({ ...formData, type: parseInt(value) })}
                                            options={[
                                                { value: '0', label: 'Bug' },
                                                { value: '1', label: 'Outage' },
                                                { value: '2', label: 'Maintenance' },
                                                { value: '3', label: 'Other' }
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Related Project (Optional)</label>
                                        {isLoadingProjects ? (
                                            <div className="text-sm text-zinc-500">Loading projects...</div>
                                        ) : (
                                            <CustomDropdown
                                                value={formData.projectId?.toString() || ''}
                                                onChange={(value) => setFormData({ ...formData, projectId: value ? parseInt(value) : null })}
                                                options={projectOptions}
                                            />
                                        )}
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {isLoading ? 'Reporting...' : 'Report Incident'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateIncidentModal;
