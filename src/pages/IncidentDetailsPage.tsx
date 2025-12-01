import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Calendar,
    ExternalLink,
    GitCommit
} from 'lucide-react';
import { clsx } from 'clsx';
import { getIncidentById, Incident, resolveIncident, closeIncident, reassignIncident } from '../services/incidentService';
import { AnimatePresence } from 'framer-motion';
import ChecklistSection from '../components/ChecklistSection';
import { toast } from 'sonner';
import { formatTimeAgo } from '../utils/dateUtils';

// Helper functions to convert numeric enums to strings
const getSeverityString = (severity: number): 'low' | 'medium' | 'high' | 'critical' => {
    const map = ['low', 'medium', 'high', 'critical'] as const;
    return map[severity] || 'low';
};

const getStatusString = (status: number): 'open' | 'investigating' | 'resolved' | 'closed' => {
    const map = ['open', 'investigating', 'resolved', 'closed'] as const;
    return map[status] || 'open';
};

const IncidentDetailsPage: React.FC = () => {
    const { incidentId } = useParams();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [reassignTo, setReassignTo] = useState('');

    useEffect(() => {
        if (incidentId) {
            loadIncident(incidentId);
        }
    }, [incidentId]);

    const loadIncident = async (id: string) => {
        setIsLoading(true);
        const data = await getIncidentById(id);
        setIncident(data);
        setIsLoading(false);
    };

    const handleResolve = async () => {
        if (!incident) return;
        const updated = await resolveIncident(incident.id);
        setIncident(updated);
        toast.success('Incident resolved');
    };

    const handleClose = async () => {
        if (!incident) return;
        const updated = await closeIncident(incident.id);
        setIncident(updated);
        toast.success('Incident closed');
    };

    const handleReassign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!incident || !reassignTo.trim()) return;
        const updated = await reassignIncident(incident.id, reassignTo);
        setIncident(updated);
        setIsReassignModalOpen(false);
        setReassignTo('');
        toast.success(`Incident reassigned to ${updated.assignedTo}`);
    };

    const getSeverityColor = (severity: number) => {
        const severityStr = getSeverityString(severity);
        switch (severityStr) {
            case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'low': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusColor = (status: number) => {
        const statusStr = getStatusString(status);
        switch (statusStr) {
            case 'resolved':
            case 'closed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'investigating':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'open':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusIcon = (status: number) => {
        const statusStr = getStatusString(status);
        switch (statusStr) {
            case 'resolved':
            case 'closed':
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'investigating':
                return <Clock className="h-5 w-5 text-blue-500" />;
            case 'open':
                return <AlertTriangle className="h-5 w-5 text-zinc-500" />;
        }
    };

    // Mock timeline data
    const timeline = [
        { time: '2h ago', action: 'Incident created', user: 'System', status: 'open' },
        { time: '1h 45m ago', action: 'Assigned to ' + (incident?.assignedTo || 'unknown'), user: 'System', status: 'open' },
        { time: '1h 30m ago', action: 'Status changed to investigating', user: incident?.assignedTo || 'unknown', status: 'investigating' },
        ...(incident?.status === 2 || incident?.status === 3
            ? [{ time: '1h ago', action: 'Incident resolved', user: incident?.assignedTo || 'unknown', status: 'resolved' }]
            : []
        )
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!incident) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold mb-2">Incident Not Found</h2>
                <Link to="/incidents" className="text-zinc-500 hover:text-white transition-colors">
                    Return to Incidents
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/incidents" className="hover:text-white transition-colors">Incidents</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{incident.id}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-sm bg-zinc-900 border border-zinc-800">
                                {getStatusIcon(incident.status)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3 mb-2">
                                    {incident.title}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={clsx("px-2 py-0.5 rounded-sm text-xs font-mono border uppercase",
                                        getSeverityColor(incident.severity)
                                    )}>
                                        {getSeverityString(incident.severity)}
                                    </span>
                                    <span className={clsx("px-2 py-0.5 rounded-sm text-xs font-mono border uppercase",
                                        getStatusColor(incident.status)
                                    )}>
                                        {getStatusString(incident.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {incident.status !== 2 && incident.status !== 3 && (
                                <button
                                    onClick={handleResolve}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-sm text-sm font-medium hover:bg-emerald-500/20 transition-all"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Resolve</span>
                                </button>
                            )}
                            {incident.status === 2 && (
                                <button
                                    onClick={handleClose}
                                    className="flex items-center gap-2 px-4 py-2 bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 rounded-sm text-sm font-medium hover:bg-zinc-500/20 transition-all"
                                >
                                    <XCircle className="h-4 w-4" />
                                    <span>Close</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsReassignModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                            >
                                <User className="h-4 w-4" />
                                <span>Reassign</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Description</h2>
                            <p className="text-zinc-400 leading-relaxed">{incident.description}</p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Activity Timeline</h2>
                            <div className="space-y-4">
                                {timeline.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-zinc-500" />
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div className="w-0.5 h-12 bg-zinc-800 mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-white font-medium">{item.action}</p>
                                            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                                                <span>{item.user}</span>
                                                <span>•</span>
                                                <span>{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Created</p>
                                    <p className="text-white font-mono">{formatTimeAgo(incident.createdAt)}</p>
                                </div>
                                {incident.resolvedAt && (
                                    <div>
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Resolved</p>
                                        <p className="text-white font-mono">{formatTimeAgo(incident.resolvedAt)}</p>
                                    </div>
                                )}
                                {incident.assignedTo && (
                                    <div>
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Assigned To</p>
                                        <p className="text-white font-mono">{incident.assignedTo}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklists */}
                        <ChecklistSection targetId={incident.id.toString()} targetType="incident" />

                        {/* Related Deployment */}
                        {incident.deploymentId && (
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Related Deployment</h3>
                                <Link
                                    to={`/deployments/${incident.deploymentId}`}
                                    className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-sm hover:bg-zinc-800 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <GitCommit className="h-4 w-4 text-zinc-500" />
                                        <span className="text-white font-mono text-sm">{incident.deploymentId}</span>
                                    </div>
                                    <ExternalLink className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                                </Link>
                            </div>
                        )}

                        {/* Related Project */}
                        {incident.projectId && (
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Related Project</h3>
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm">
                                    <p className="text-white font-mono text-sm">{incident.projectId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reassign Modal */}
            <AnimatePresence>
                {isReassignModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsReassignModalOpen(false)}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                                            <User className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Reassign Incident</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsReassignModalOpen(false)}
                                        className="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleReassign} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Assign To</label>
                                        <input
                                            type="text"
                                            value={reassignTo}
                                            onChange={(e) => setReassignTo(e.target.value)}
                                            placeholder="Enter username"
                                            required
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsReassignModalOpen(false)}
                                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-sm hover:bg-zinc-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors"
                                        >
                                            Reassign
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IncidentDetailsPage;
