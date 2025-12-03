import React, { useState } from 'react';
import { Trash2, Loader2, GitBranch } from 'lucide-react';
import { Project, projectService } from '../../../services/projectService';
import Input from '../../../components/ui/Input';

interface ProjectSettingsTabProps {
    project: Project;
    onUpdate: (project: Project) => void;
    onDelete: () => void;
}

const ProjectSettingsTab: React.FC<ProjectSettingsTabProps> = ({ project, onUpdate, onDelete }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description,
        repoUrl: project.repoUrl || '',
        apiKey: project.apiKey || '',
        webhookSecret: project.webhookSecret || ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await projectService.updateProject(project.id, formData);
            onUpdate(updated);

            // Scroll to top for visual feedback
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Keep spinner visible for 500ms for better UX feedback
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to update project', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await onDelete();
        } catch (error) {
            console.error('Failed to delete project', error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-8">
                <h3 className="text-lg font-bold text-white mb-6">Project Settings</h3>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Project Name"
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px]"
                                placeholder="Project Description"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Repository URL</label>
                            <div className="relative">
                                <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <input
                                    type="url"
                                    value={formData.repoUrl}
                                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm pl-9 pr-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Secrets & Keys</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">API Key</label>
                                <input
                                    type="password"
                                    value={formData.apiKey}
                                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Webhook Secret</label>
                                <input
                                    type="password"
                                    value={formData.webhookSecret}
                                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-rose-500/10 text-rose-400 font-medium rounded-sm hover:bg-rose-500/20 transition-colors flex items-center gap-2"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete Project
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors flex items-center gap-2"
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectSettingsTab;
