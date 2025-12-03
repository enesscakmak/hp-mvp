import React from 'react';
import { Plus, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import { ProjectResource } from '../../../services/resourceService';

interface ResourceAttributesTabProps {
    activeResource: ProjectResource;
    allResources: ProjectResource[];
    newAttrKey: string;
    setNewAttrKey: (key: string) => void;
    newAttrValue: string;
    setNewAttrValue: (value: string) => void;
    copiedId: number | null;
    onAddAttribute: () => void;
    onDeleteAttribute: (id: number) => void;
    onCopy: (text: string, id: number) => void;
    onOpenResource: (name: string) => void;
    onCreateAndLink: (name: string) => void;
}

const ResourceAttributesTab: React.FC<ResourceAttributesTabProps> = ({
    activeResource,
    allResources,
    newAttrKey,
    setNewAttrKey,
    newAttrValue,
    setNewAttrValue,
    copiedId,
    onAddAttribute,
    onDeleteAttribute,
    onCopy,
    onOpenResource,
    onCreateAndLink
}) => {
    return (
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
                                                    onClick={() => onOpenResource(linkedResource.name)}
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
                                                            onClick={() => onCreateAndLink(attr.value)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-blue-400 transition-opacity"
                                                            title="Create this resource"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => onCopy(attr.value, attr.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-opacity ml-2"
                                                title="Copy value"
                                            >
                                                {copiedId === attr.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onDeleteAttribute(attr.id)}
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
                                        if (e.key === 'Enter') onAddAttribute();
                                    }}
                                />
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    onClick={onAddAttribute}
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
    );
};

export default ResourceAttributesTab;
