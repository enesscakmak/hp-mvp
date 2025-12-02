import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Loader2 } from 'lucide-react';
import { createDeployment } from '../services/deploymentService';
import { projectService, Project } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import CustomDropdown from './CustomDropdown';
import { toast } from 'sonner';

interface TriggerDeploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    preselectedProject?: string;
}

const TriggerDeploymentModal: React.FC<TriggerDeploymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    preselectedProject
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        project: preselectedProject || '',
        branch: 'main',
        environment: 'staging' as 'production' | 'staging' | 'preview'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadProjects();
        }
    }, [isOpen]);

    // Update project when preselectedProject changes
    useEffect(() => {
        if (preselectedProject) {
            setFormData(prev => ({ ...prev, project: preselectedProject }));
        }
    }, [preselectedProject]);

    const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const data = await projectService.getProjects();
            setProjects(data);
            // If no project is selected and we have projects, select the first one
            if (!formData.project && !preselectedProject && data.length > 0) {
                setFormData(prev => ({ ...prev, project: data[0].name }));
            }
        } catch (error) {
            console.error('Failed to load projects', error);
            toast.error('Failed to load projects');
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await createDeployment({
                projectName: formData.project,
                branch: formData.branch,
                environment: formData.environment,
                version: 'v' + Math.floor(Math.random() * 100) + '.' + Math.floor(Math.random() * 10) + '.' + Math.floor(Math.random() * 10),
                notes: 'Manual deployment triggered via dashboard',
                commitHash: Math.random().toString(36).substring(2, 10),
                commitMessage: 'Manual deployment',
                author: user?.username || 'Unknown User',
                duration: '0s'
            });
            setIsLoading(false);
            toast.success('Deployment triggered successfully');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                project: preselectedProject || '',
                branch: 'main',
                environment: 'staging'
            });
        } catch (err) {
            setError('Failed to trigger deployment');
            toast.error('Failed to trigger deployment');
            setIsLoading(false);
        }
    };

    const projectOptions = projects.map(p => ({ value: p.name, label: p.name }));

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
                                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                                            <Rocket className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Trigger Deployment</h2>
                                    </div>
                                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-sm text-rose-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Project</label>
                                        {isLoadingProjects ? (
                                            <div className="text-sm text-zinc-500">Loading projects...</div>
                                        ) : (
                                            <CustomDropdown
                                                value={formData.project}
                                                onChange={(value) => setFormData({ ...formData, project: value })}
                                                options={projectOptions}
                                                disabled={!!preselectedProject}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Branch</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.branch}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                                            placeholder="e.g. main, develop, feature/new-feature"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Environment</label>
                                        <CustomDropdown
                                            value={formData.environment}
                                            onChange={(value) => setFormData({ ...formData, environment: value as any })}
                                            options={[
                                                { value: 'preview', label: 'Preview' },
                                                { value: 'staging', label: 'Staging' },
                                                { value: 'production', label: 'Production' }
                                            ]}
                                        />
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
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {isLoading ? 'Deploying...' : 'Deploy'}
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

export default TriggerDeploymentModal;
