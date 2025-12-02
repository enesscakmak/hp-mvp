import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { infrastructureService, InfrastructureConfig } from '../services/infrastructureService';

interface InfrastructureConfigManagerProps {
    projectId: number;
}

const InfrastructureConfigManager: React.FC<InfrastructureConfigManagerProps> = ({ projectId }) => {
    const [configs, setConfigs] = useState<InfrastructureConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        loadConfigs();
    }, [projectId]);

    const loadConfigs = async () => {
        try {
            const data = await infrastructureService.getByProject(projectId);
            setConfigs(data);
        } catch (error) {
            console.error('Failed to load infra configs:', error);
            toast.error('Failed to load configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newKey || !newValue || !newCategory) return;

        try {
            const created = await infrastructureService.create({
                category: newCategory,
                key: newKey,
                value: newValue,
                projectId
            });
            setConfigs([...configs, created]);
            setNewKey('');
            setNewValue('');
            // Keep category for faster entry
            setIsAdding(false);
            toast.success('Configuration added');
        } catch (error) {
            console.error('Failed to add config:', error);
            toast.error('Failed to add configuration');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this configuration?')) return;

        try {
            await infrastructureService.delete(id);
            setConfigs(configs.filter(c => c.id !== id));
            toast.success('Configuration deleted');
        } catch (error) {
            console.error('Failed to delete config:', error);
            toast.error('Failed to delete configuration');
        }
    };

    // Group configs by category
    const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.category]) {
            acc[config.category] = [];
        }
        acc[config.category].push(config);
        return acc;
    }, {} as Record<string, InfrastructureConfig[]>);

    const categories = Array.from(new Set(configs.map(c => c.category)));

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Additional Configuration
                </h4>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                    <Plus className="h-3 w-3" />
                    Add Config
                </button>
            </div>

            {isAdding && (
                <div className="bg-zinc-900/50 p-3 rounded-sm border border-zinc-800 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Category</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. Kubernetes"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                                list="categories"
                                autoFocus
                            />
                            <datalist id="categories">
                                {categories.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Key</label>
                            <input
                                type="text"
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                placeholder="e.g. Cluster IP"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Value</label>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder="e.g. 10.0.0.1"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-sm px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!newKey || !newValue || !newCategory}
                            className="px-3 py-1 bg-white text-black text-xs font-bold rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            <Save className="h-3 w-3" />
                            Save
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedConfigs).map(([category, items]) => (
                    <div key={category} className="bg-zinc-900/20 border border-zinc-800/50 rounded-sm p-4">
                        <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono mb-3 border-b border-zinc-800/50 pb-2">
                            {category}
                        </h5>
                        <div className="space-y-2">
                            {items.map((config) => (
                                <div key={config.id} className="group flex items-center justify-between py-1 hover:bg-zinc-900/50 px-2 -mx-2 rounded-sm transition-colors">
                                    <div>
                                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-0.5">{config.key}</p>
                                        <p className="text-white font-mono text-sm">{config.value}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(config.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-sm transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {configs.length === 0 && !isAdding && (
                <p className="text-zinc-500 text-xs font-mono italic text-center py-8 border border-dashed border-zinc-800 rounded-sm">
                    No additional configuration yet. Click "Add Config" to start.
                </p>
            )}
        </div>
    );
};

export default InfrastructureConfigManager;
