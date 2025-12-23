import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createIncident } from '../../../services/incidentService';
import { projectService } from '../../../services/projectService';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
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

    useEffect(() => {
        if (isOpen) {
            loadProjects();
        }
    }, [isOpen]);

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
            toast.error('Failed to load projects');
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Report Incident"
            icon={<AlertTriangle className="h-5 w-5 text-rose-400" />}
        >
            <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Project</label>
                            <CustomDropdown
                                options={projectOptions}
                                value={formData.projectId?.toString() || ''}
                                onChange={(val) => setFormData({ ...formData, projectId: val ? parseInt(val) : null })}
                                placeholder="Select a project"
                                className="w-full"
                            />
                        </div>

                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Incident title"
                            required
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Severity</label>
                            <CustomDropdown
                                options={[
                                    { value: '0', label: 'Low' },
                                    { value: '1', label: 'Medium' },
                                    { value: '2', label: 'High' },
                                    { value: '3', label: 'Critical' }
                                ]}
                                value={formData.severity.toString()}
                                onChange={(val) => setFormData({ ...formData, severity: parseInt(val) })}
                                placeholder="Select severity"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Type</label>
                            <CustomDropdown
                                options={[
                                    { value: '0', label: 'Bug' },
                                    { value: '1', label: 'Outage' },
                                    { value: '2', label: 'Maintenance' },
                                    { value: '3', label: 'Other' }
                                ]}
                                value={formData.type.toString()}
                                onChange={(val) => setFormData({ ...formData, type: parseInt(val) })}
                                placeholder="Select type"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the incident..."
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px]"
                                required
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
                            leftIcon={<AlertTriangle className="h-4 w-4" />}
                        >
                            Create Incident
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateIncidentModal;
