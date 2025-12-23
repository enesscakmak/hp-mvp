import React, { useState, useEffect } from 'react';
import { ProjectResource, resourceService } from '../../../services/resourceService';
import { Loader2, Plus, Trash2, Database, Server, Globe, Box, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import ResourceDetailModal from './ResourceDetailModal';

interface ResourceManagerProps {
    projectId: number;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ projectId }) => {
    const [resources, setResources] = useState<ProjectResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingResource, setIsAddingResource] = useState(false);

    // New Resource State
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('Database');

    // Modal State
    const [selectedResource, setSelectedResource] = useState<ProjectResource | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        loadResources();
    }, [projectId]);

    const loadResources = async () => {
        try {
            const data = await resourceService.getByProject(projectId);
            setResources(data);
        } catch (error) {
            console.error('Failed to load resources:', error);
            toast.error('Failed to load resources');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddResource = async () => {
        if (!newName) return;

        try {
            const created = await resourceService.create({
                name: newName,
                type: newType,
                projectId
            });
            setResources([...resources, { ...created, attributes: [] }]);
            setNewName('');
            setIsAddingResource(false);
            toast.success('Resource created');
        } catch (error) {
            console.error('Failed to create resource:', error);
            toast.error('Failed to create resource');
        }
    };

    const handleDeleteResource = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevent opening modal
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await resourceService.delete(id);
            setResources(resources.filter(r => r.id !== id));
            toast.success('Resource deleted');
        } catch (error) {
            console.error('Failed to delete resource:', error);
            toast.error('Failed to delete resource');
        }
    };

    const getIconForType = (type: string) => {
        switch (type.toLowerCase()) {
            case 'database': return <Database className="h-4 w-4" />;
            case 'server': return <Server className="h-4 w-4" />;
            case 'loadbalancer': return <Globe className="h-4 w-4" />;
            case 'kubernetes': return <Box className="h-4 w-4" />;
            case 'network': return <Globe className="h-4 w-4" />;
            case 'cluster': return <Server className="h-4 w-4" />;
            default: return <Box className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>;
    }

    const filteredResources = showAll
        ? resources
        : resources.filter(r => r.type !== 'Cluster');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Infrastructure Wiki
                </h4>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`text-xs font-mono transition-colors uppercase tracking-wider flex items-center gap-1 ${showAll ? 'text-blue-400' : 'text-zinc-500 hover:text-white'
                            }`}
                    >
                        {showAll ? 'Hide System Resources' : 'View All Resources'}
                    </button>
                    <div className="h-4 w-px bg-zinc-800"></div>
                    <button
                        onClick={() => setIsAddingResource(true)}
                        className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
                    >
                        <Plus className="h-3 w-3" />
                        Add Resource
                    </button>
                </div>
            </div>

            {isAddingResource && (
                <div className="bg-zinc-900/50 p-4 rounded-sm border border-zinc-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Primary Database"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Type</label>
                            <select
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="Database">Database</option>
                                <option value="Redis">Redis</option>
                                <option value="Kubernetes">Kubernetes</option>
                                <option value="Network">Network</option>
                                <option value="LoadBalancer">Load Balancer</option>
                                <option value="Worker">Worker</option>
                                <option value="Service">Service</option>
                                <option value="Cluster">Cluster</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAddingResource(false)}
                            className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddResource}
                            disabled={!newName}
                            className="px-3 py-1 bg-white text-black text-xs font-bold rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            <Save className="h-3 w-3" />
                            Create Resource
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        onClick={() => setSelectedResource(resource)}
                        className="bg-zinc-900/20 border border-zinc-800 rounded-sm p-4 hover:border-blue-500/50 hover:bg-zinc-900/40 transition-all cursor-pointer group relative"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-sm text-zinc-400 group-hover:text-blue-400 transition-colors">
                                    {getIconForType(resource.type)}
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-white font-mono group-hover:text-blue-400 transition-colors">{resource.name}</h5>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">{resource.type}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteResource(e, resource.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-sm transition-all z-10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-1 pl-11">
                            {resource.attributes.slice(0, 3).map((attr) => (
                                <div key={attr.id} className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-zinc-600">{attr.key}:</span>
                                    <span className="text-zinc-400 truncate">{attr.value}</span>
                                </div>
                            ))}
                            {resource.attributes.length > 3 && (
                                <p className="text-[10px] text-zinc-600 font-mono pl-1">+{resource.attributes.length - 3} more...</p>
                            )}
                        </div>

                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                        </div>
                    </div>
                ))}
            </div>

            {resources.length === 0 && !isAddingResource && (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-sm">
                    <Database className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm font-mono">No resources defined.</p>
                    <button
                        onClick={() => setIsAddingResource(true)}
                        className="mt-2 text-blue-400 hover:text-blue-300 text-xs font-mono hover:underline"
                    >
                        Create your first resource
                    </button>
                </div>
            )}

            {selectedResource && (
                <ResourceDetailModal
                    initialResource={selectedResource}
                    allResources={resources}
                    isOpen={!!selectedResource}
                    onClose={() => setSelectedResource(null)}
                    onUpdate={() => {
                        loadResources();
                        resourceService.getByProject(projectId).then(data => {
                            const updated = data.find(r => r.id === selectedResource.id);
                            if (updated) setSelectedResource(updated);
                        });
                    }}
                />
            )}
        </div>
    );
};

export default ResourceManager;
