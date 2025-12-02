import React, { useState, useEffect } from 'react';
import { ProjectResource, ResourceAttribute, resourceService } from '../services/resourceService';
import { X, Save, Plus, Trash2, Copy, Check, FileText, List as ListIcon, ExternalLink } from 'lucide-react';
import WikiEditor from './WikiEditor';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

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
    const [isSaving, setIsSaving] = useState(false);

    // Attribute State (for the ACTIVE resource)
    const [newAttrKey, setNewAttrKey] = useState('');
    const [newAttrValue, setNewAttrValue] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Initialize with the clicked resource
    useEffect(() => {
        if (isOpen && initialResource) {
            setOpenResources([initialResource]);
            setActiveResourceId(initialResource.id);
            setActiveTab('wiki');
            setIsEditingWiki(false);
        }
    }, [isOpen, initialResource]);

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
        setIsSaving(true);
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
        } finally {
            setIsSaving(false);
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
                    <div className="flex bg-zinc-950 rounded-md p-1 border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('wiki')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-2 ${activeTab === 'wiki' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <FileText className="h-3 w-3" />
                            Wiki
                        </button>
                        <button
                            onClick={() => setActiveTab('attributes')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-2 ${activeTab === 'attributes' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <ListIcon className="h-3 w-3" />
                            Attributes
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-zinc-900">
                    {activeTab === 'wiki' && (
                        <div className="flex-1 overflow-y-auto p-8">
                            {isEditingWiki ? (
                                <div className="h-full flex flex-col">
                                    <div className="flex-1">
                                        <WikiEditor
                                            initialContent={activeResource.description || ''}
                                            onSave={handleSaveDescription}
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
                    )}

                    {activeTab === 'attributes' && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden max-w-4xl mx-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-900/50 text-zinc-500 font-mono uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Key</th>
                                            <th className="px-4 py-3 font-medium">Value</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {(activeResource.attributes || []).map((attr) => {
                                            // Check if this attribute value links to another resource
                                            const linkedResource = allResources.find(r => r.name === attr.value);

                                            return (
                                                <tr key={attr.id} className="group hover:bg-zinc-900/30 transition-colors">
                                                    <td className="px-4 py-3 font-mono text-zinc-400">{attr.key}</td>
                                                    <td className="px-4 py-3 font-mono text-white">
                                                        <div className="flex items-center gap-2">
                                                            {linkedResource ? (
                                                                <button
                                                                    onClick={() => handleOpenResource(linkedResource.name)}
                                                                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                                                                >
                                                                    {attr.value}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </button>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="truncate max-w-md">{attr.value}</span>
                                                                    {/* Show Create button if it looks like a resource name (no spaces, etc) and not a URL */}
                                                                    {!attr.value.includes(' ') && !attr.value.includes('http') && (
                                                                        <button
                                                                            onClick={() => handleCreateAndLink(attr.value)}
                                                                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-blue-400 transition-opacity"
                                                                            title="Create this resource"
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <button
                                                                onClick={() => copyToClipboard(attr.value, attr.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-opacity ml-2"
                                                                title="Copy value"
                                                            >
                                                                {copiedId === attr.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => handleDeleteAttribute(attr.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-all"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-zinc-900/20">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={newAttrKey}
                                                    onChange={(e) => setNewAttrKey(e.target.value)}
                                                    placeholder="New Key"
                                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={newAttrValue}
                                                    onChange={(e) => setNewAttrValue(e.target.value)}
                                                    placeholder="New Value"
                                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddAttribute();
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={handleAddAttribute}
                                                    disabled={!newAttrKey || !newAttrValue}
                                                    className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailModal;
