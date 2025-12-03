import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { createDeployment } from '../../../services/deploymentService';
import { projectService, Project } from '../../../services/projectService';
import { useAuth } from '../../../context/AuthContext';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Trigger Deployment"
            icon={<Rocket className="h-5 w-5 text-blue-400" />}
        >
            <div className="p-6 pt-0">
                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-sm text-rose-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Project</label>
                            {isLoadingProjects ? (
                                <div className="text-sm text-zinc-500">Loading projects...</div>
                            ) : (
                                <CustomDropdown
                                    value={formData.project}
                                    onChange={(value) => setFormData({ ...formData, project: value })}
                                    options={projectOptions}
                                    disabled={!!preselectedProject}
                                    className="w-full"
                                />
                            )}
                        </div>

                        <Input
                            label="Branch"
                            value={formData.branch}
                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            placeholder="e.g. main, develop, feature/new-feature"
                            required
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Environment</label>
                            <CustomDropdown
                                value={formData.environment}
                                onChange={(value) => setFormData({ ...formData, environment: value as any })}
                                options={[
                                    { value: 'preview', label: 'Preview' },
                                    { value: 'staging', label: 'Staging' },
                                    { value: 'production', label: 'Production' }
                                ]}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
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
                            isLoading={isLoading}
                            leftIcon={<Rocket className="h-4 w-4" />}
                        >
                            Deploy
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TriggerDeploymentModal;
