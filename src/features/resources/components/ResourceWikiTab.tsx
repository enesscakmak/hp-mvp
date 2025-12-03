import React from 'react';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import WikiEditor from '../../../components/ui/WikiEditor';
import { ProjectResource } from '../../../services/resourceService';

interface ResourceWikiTabProps {
    activeResource: ProjectResource;
    isEditingWiki: boolean;
    setIsEditingWiki: (editing: boolean) => void;
    onSave: (content: string) => Promise<void>;
}

const ResourceWikiTab: React.FC<ResourceWikiTabProps> = ({
    activeResource,
    isEditingWiki,
    setIsEditingWiki,
    onSave
}) => {
    return (
        <div className="flex-1 overflow-y-auto p-8">
            {isEditingWiki ? (
                <div className="h-full flex flex-col">
                    <div className="flex-1">
                        <WikiEditor
                            initialContent={activeResource.description || ''}
                            onSave={onSave}
                            onCancel={() => setIsEditingWiki(false)}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto w-full">
                    {activeResource.description ? (
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>{activeResource.description}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                            <p className="text-zinc-500 mb-4">No documentation available for this resource.</p>
                            <button
                                onClick={() => setIsEditingWiki(true)}
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                Start writing documentation
                            </button>
                        </div>
                    )}
                    <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-end">
                        <button
                            onClick={() => setIsEditingWiki(true)}
                            className="text-sm text-zinc-500 hover:text-white flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Edit Documentation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceWikiTab;
