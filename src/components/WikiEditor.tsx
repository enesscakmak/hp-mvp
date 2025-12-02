import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit2, Save, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface WikiEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    onCancel: () => void;
}

const WikiEditor: React.FC<WikiEditorProps> = ({ initialContent, onSave, onCancel }) => {
    const [content, setContent] = useState(initialContent);
    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(content);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm overflow-hidden flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2 bg-zinc-950 rounded-sm p-1 border border-zinc-800">
                    <button
                        onClick={() => setMode('write')}
                        className={clsx(
                            "px-3 py-1.5 rounded-sm text-xs font-medium flex items-center gap-2 transition-colors",
                            mode === 'write'
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Edit2 className="h-3 w-3" />
                        Write
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        className={clsx(
                            "px-3 py-1.5 rounded-sm text-xs font-medium flex items-center gap-2 transition-colors",
                            mode === 'preview'
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Eye className="h-3 w-3" />
                        Preview
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <X className="h-3 w-3" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-white text-black rounded-sm text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative">
                {mode === 'write' ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full bg-zinc-950 p-6 text-zinc-300 font-mono text-sm focus:outline-none resize-none"
                        placeholder="# Project Title\n\nWrite your documentation here..."
                        autoFocus
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-950 p-8 overflow-y-auto">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WikiEditor;
