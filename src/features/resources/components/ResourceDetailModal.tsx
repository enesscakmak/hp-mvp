import React, { useState, useEffect } from 'react';
import { ProjectResource, resourceService } from '../../../services/resourceService';
import { X, FileText, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';
import ResourceWikiTab from './ResourceWikiTab';
import ResourceAttributesTab from './ResourceAttributesTab';
import Button from '../../../components/ui/Button';

interface ResourceDetailModalProps {
    initialResource: ProjectResource;
    allResources: ProjectResource[];
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ initialResource, allResources, isOpen, onClose, onUpdate }) => {
    // Tab State: Array of open resources
    const [openResources, setOpenResources] = useState<ProjectResource[]>([]);
    const [activeResourceId, setActiveResourceId] = useState<number>(0);

    // Content State (for the ACTIVE resource)
    const [activeTab, setActiveTab] = useState<'wiki' | 'attributes'>('wiki');
    const [isEditingWiki, setIsEditingWiki] = useState(false);

    // Attribute State (for the ACTIVE resource)
    const [newAttrKey, setNewAttrKey] = useState('');
    const [newAttrValue, setNewAttrValue] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Initialize with the clicked resource ONLY ONCE (or when it changes and we have nothing open)
    useEffect(() => {
        if (isOpen && initialResource && openResources.length === 0) {
            setOpenResources([initialResource]);
            setActiveResourceId(initialResource.id);
            setActiveTab('wiki');
            setIsEditingWiki(false);
        }
    }, [isOpen, initialResource]); // We rely on openResources.length check to prevent reset

    // Sync open resources with latest data from parent
    useEffect(() => {
        if (allResources.length > 0 && openResources.length > 0) {
            setOpenResources(prev => prev.map(opened => {
                const updated = allResources.find(latest => latest.id === opened.id);
                return updated || opened;
            }));
        }
    }, [allResources]);

    // Get the currently active resource object
    const activeResource = openResources.find(r => r.id === activeResourceId) || initialResource;

    const handleOpenResource = (resourceName: string) => {
        const target = allResources.find(r => r.name === resourceName);
        if (target) {
            if (!openResources.find(r => r.id === target.id)) {
                setOpenResources([...openResources, target]);
            }
            setActiveResourceId(target.id);
            setActiveTab('wiki'); // Reset to wiki tab for new resource
        }
    };

    const handleCloseTab = (e: React.MouseEvent, resourceId: number) => {
        e.stopPropagation();
        const newOpen = openResources.filter(r => r.id !== resourceId);
        if (newOpen.length === 0) {
            onClose();
        } else {
            setOpenResources(newOpen);
            if (activeResourceId === resourceId) {
                setActiveResourceId(newOpen[newOpen.length - 1].id);
            }
        }
    };

    const handleSaveDescription = async (newContent: string) => {
        try {
            await resourceService.update(activeResource.id, { ...activeResource, description: newContent });

            // Update local state
            setOpenResources(openResources.map(r =>
                r.id === activeResource.id ? { ...r, description: newContent } : r
            ));

            setIsEditingWiki(false);
            onUpdate();
            toast.success('Documentation updated');
        } catch (error) {
            console.error('Failed to update description:', error);
            toast.error('Failed to update documentation');
        }
    };

    const handleAddAttribute = async () => {
        if (!newAttrKey || !newAttrValue) return;

        try {
            const created = await resourceService.addAttribute(activeResource.id, {
                key: newAttrKey,
                value: newAttrValue
            });

            // Update local state
            setOpenResources(openResources.map(r =>
                r.id === activeResource.id ? { ...r, attributes: [...(r.attributes || []), created] } : r
            ));

            setNewAttrKey('');
            setNewAttrValue('');
            onUpdate();
            toast.success('Attribute added');
        } catch (error) {
            console.error('Failed to add attribute:', error);
            toast.error('Failed to add attribute');
        }
    };

    const handleDeleteAttribute = async (id: number) => {
        try {
            await resourceService.deleteAttribute(id);

            // Update local state
            setOpenResources(openResources.map(r =>
                r.id === activeResource.id ? { ...r, attributes: r.attributes.filter(a => a.id !== id) } : r
            ));

            onUpdate();
            toast.success('Attribute deleted');
        } catch (error) {
            console.error('Failed to delete attribute:', error);
            toast.error('Failed to delete attribute');
        }
    };

    const copyToClipboard = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success('Copied to clipboard');
    };

    const handleCreateAndLink = async (resourceName: string) => {
        if (!confirm(`Create new resource "${resourceName}"?`)) return;

        try {
            const newResource = await resourceService.create({
                name: resourceName,
                type: 'Cluster', // Default type, user can change later
                projectId: activeResource.projectId
            });

            // Add to open resources and switch to it
            setOpenResources([...openResources, newResource]);
            setActiveResourceId(newResource.id);
            setActiveTab('wiki');

            // Notify parent to refresh list
            onUpdate();
            toast.success(`Created ${resourceName}`);
        } catch (error) {
            console.error('Failed to create resource:', error);
            toast.error('Failed to create resource');
        }
    };

    if (!isOpen || !activeResource) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Browser-like Tab Bar */}
                <div className="flex items-center bg-zinc-950 border-b border-zinc-800 px-2 pt-2 gap-1 overflow-x-auto">
                    {openResources.map(res => (
                        <div
                            key={res.id}
                            onClick={() => setActiveResourceId(res.id)}
                            className={`
                                group flex items-center gap-2 px-3 py-2 rounded-t-md text-xs font-medium cursor-pointer border-t border-x border-transparent select-none min-w-[150px] max-w-[200px]
                                ${activeResourceId === res.id
                                    ? 'bg-zinc-900 text-white border-zinc-800 border-b-zinc-900'
                                    : 'bg-zinc-900/30 text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}
                            `}
                        >
                            <span className="truncate flex-1">{res.name}</span>
                            <button
                                onClick={(e) => handleCloseTab(e, res.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-800 rounded-full transition-all"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <div className="flex-1 border-b border-zinc-800 h-full"></div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white mb-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Resource Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-md">
                            <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{activeResource.name}</h2>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{activeResource.type}</p>
                        </div>
                    </div>

                    {/* View Tabs */}
                    <div className="flex bg-zinc-950 rounded-md p-1 border border-zinc-800 gap-1">
                        <Button
                            variant={activeTab === 'wiki' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('wiki')}
                            leftIcon={<FileText className="h-3 w-3" />}
                            className={activeTab === 'wiki' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
                        >
                            Wiki
                        </Button>
                        <Button
                            variant={activeTab === 'attributes' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('attributes')}
                            leftIcon={<ListIcon className="h-3 w-3" />}
                            className={activeTab === 'attributes' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
                        >
                            Attributes
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-zinc-900">
                    {activeTab === 'wiki' && (
                        <ResourceWikiTab
                            activeResource={activeResource}
                            isEditingWiki={isEditingWiki}
                            setIsEditingWiki={setIsEditingWiki}
                            onSave={handleSaveDescription}
                        />
                    )}

                    {activeTab === 'attributes' && (
                        <ResourceAttributesTab
                            activeResource={activeResource}
                            allResources={allResources}
                            newAttrKey={newAttrKey}
                            setNewAttrKey={setNewAttrKey}
                            newAttrValue={newAttrValue}
                            setNewAttrValue={setNewAttrValue}
                            copiedId={copiedId}
                            onAddAttribute={handleAddAttribute}
                            onDeleteAttribute={handleDeleteAttribute}
                            onCopy={copyToClipboard}
                            onOpenResource={handleOpenResource}
                            onCreateAndLink={handleCreateAndLink}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailModal;
