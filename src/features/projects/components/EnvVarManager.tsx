
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { envVarService, EnvironmentVariable } from '../../../services/envVarService';

interface EnvVarManagerProps {
    projectId: number;
}

const EnvVarManager: React.FC<EnvVarManagerProps> = ({ projectId }) => {
    const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [visibleValues, setVisibleValues] = useState<Set<number>>(new Set());
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        loadEnvVars();
    }, [projectId]);

    const loadEnvVars = async () => {
        try {
            const data = await envVarService.getByProject(projectId);
            setEnvVars(data);
        } catch (error) {
            console.error('Failed to load env vars:', error);
            toast.error('Failed to load environment variables');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newKey || !newValue) return;

        try {
            const created = await envVarService.create({
                key: newKey.toUpperCase(),
                value: newValue,
                projectId
            });
            setEnvVars([...envVars, created]);
            setNewKey('');
            setNewValue('');
            setIsAdding(false);
            toast.success('Variable added');
        } catch (error) {
            console.error('Failed to add env var:', error);
            toast.error('Failed to add variable');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this variable?')) return;

        try {
            await envVarService.delete(id);
            setEnvVars(envVars.filter(e => e.id !== id));
            toast.success('Variable deleted');
        } catch (error) {
            console.error('Failed to delete env var:', error);
            toast.error('Failed to delete variable');
        }
    };

    const toggleVisibility = (id: number) => {
        const newVisible = new Set(visibleValues);
        if (newVisible.has(id)) {
            newVisible.delete(id);
        } else {
            newVisible.add(id);
        }
        setVisibleValues(newVisible);
    };

    const copyToClipboard = (id: number, value: string) => {
        navigator.clipboard.writeText(value);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success('Copied to clipboard');
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Environment Variables</h3>
                <Button
                    onClick={() => setIsAdding(true)}
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                >
                    Add Variable
                </Button>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 font-medium">Key</th>
                            <th className="px-4 py-3 font-medium">Value</th>
                            <th className="px-4 py-3 font-medium w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {isAdding && (
                            <tr className="bg-zinc-900/30">
                                <td className="px-4 py-3">
                                    <Input
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        placeholder="KEY_NAME"
                                        className="text-xs font-mono py-1 h-8"
                                        autoFocus
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        placeholder="Value"
                                        className="text-xs font-mono py-1 h-8"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <Button
                                        onClick={handleAdd}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    >
                                        <Save className="h-3.5 w-3.5" />
                                    </Button>
                                </td>
                            </tr>
                        )}
                        {envVars.map(env => (
                            <tr key={env.id} className="group hover:bg-zinc-900/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-zinc-300">{env.key}</td>
                                <td className="px-4 py-3 font-mono text-zinc-400">
                                    {visibleValues.has(env.id) ? env.value : '••••••••••••••••'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleVisibility(env.id)}
                                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-colors"
                                            title={visibleValues.has(env.id) ? "Hide" : "Show"}
                                        >
                                            {visibleValues.has(env.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(env.id, env.value)}
                                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm transition-colors"
                                            title="Copy"
                                        >
                                            {copiedId === env.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(env.id)}
                                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-sm transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {envVars.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-zinc-500 text-sm">
                                    No environment variables defined.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default EnvVarManager;
