import React from 'react';
import { Terminal } from 'lucide-react';
import { clsx } from 'clsx';

interface LogEntry {
    time: string;
    level: 'info' | 'error' | 'success' | 'warning';
    message: string;
}

interface DeploymentLogsProps {
    logs: LogEntry[];
}

const DeploymentLogs: React.FC<DeploymentLogsProps> = ({ logs }) => {
    const getLogColor = (level: string) => {
        switch (level) {
            case 'success': return 'text-emerald-400';
            case 'error': return 'text-rose-400';
            case 'warning': return 'text-amber-400';
            default: return 'text-zinc-400';
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm overflow-hidden">
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
                    <Terminal className="h-4 w-4" />
                    <span>Build Output</span>
                </div>
                <button className="text-xs text-zinc-500 hover:text-white transition-colors">
                    Download Logs
                </button>
            </div>
            <div className="p-4 font-mono text-sm space-y-1 max-h-[600px] overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <span className="text-zinc-600 select-none">{log.time}</span>
                        <span className={clsx("flex-1", getLogColor(log.level))}>
                            {log.message}
                        </span>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-zinc-500 italic">No logs available</div>
                )}
            </div>
        </div>
    );
};

export default DeploymentLogs;
