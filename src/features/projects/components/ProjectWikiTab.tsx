import React, { useState } from 'react';
import { Edit2, Activity } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import WikiEditor from '../../../components/ui/WikiEditor';
import { Project, projectService } from '../../../services/projectService';

interface ProjectWikiTabProps {
    project: Project;
    onUpdate: (project: Project) => void;
}

const ProjectWikiTab: React.FC<ProjectWikiTabProps> = ({ project, onUpdate }) => {
    const [isEditingWiki, setIsEditingWiki] = useState(false);

    return (
        <div className="space-y-6">
            {isEditingWiki ? (
                <WikiEditor
                    initialContent={project.wikiContent || ''}
                    onSave={async (content) => {
                        try {
                            const updatedProject = { ...project, wikiContent: content };
                            await projectService.updateProject(project.id, updatedProject);
                            onUpdate(updatedProject);
                            setIsEditingWiki(false);
                            toast.success('Wiki updated successfully');
                        } catch (error) {
                            console.error('Failed to update wiki:', error);
                            toast.error('Failed to update wiki');
                        }
                    }}
                    onCancel={() => setIsEditingWiki(false)}
                />
            ) : (
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Project Documentation</h3>
                        <button
                            onClick={() => setIsEditingWiki(true)}
                            className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2"
                        >
                            <Edit2 className="h-3 w-3" />
                            Edit Wiki
                        </button>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        {project.wikiContent ? (
                            <ReactMarkdown>{project.wikiContent}</ReactMarkdown>
                        ) : (
                            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-sm">
                                <Activity className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white">No Documentation</h3>
                                <p className="text-zinc-500 mt-2 mb-4">This project has no wiki content yet.</p>
                                <button
                                    onClick={() => setIsEditingWiki(true)}
                                    className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors"
                                >
                                    Add Documentation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectWikiTab;
