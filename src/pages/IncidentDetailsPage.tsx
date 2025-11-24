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
import { getIncidentById, Incident } from '../services/incidentService';

const IncidentDetailsPage: React.FC = () => {
    const { incidentId } = useParams();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const getSeverityColor = (severity: Incident['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'low': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusColor = (status: Incident['status']) => {
        switch (status) {
            case 'resolved':
            case 'closed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'investigating':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'open':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusIcon = (status: Incident['status']) => {
        switch (status) {
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
        { time: '1h 45m ago', action: 'Assigned to enes', user: 'System', status: 'open' },
        { time: '1h 30m ago', action: 'Status changed to investigating', user: 'enes', status: 'investigating' },
        ...(incident?.status === 'resolved' || incident?.status === 'closed'
            ? [{ time: '1h ago', action: 'Incident resolved', user: 'enes', status: 'resolved' }]
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
                <div className="max-w-7xl mx-auto px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/incidents" className="hover:text-white transition-colors">Incidents</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{incident.id}</span>
                    </div>

                    <div className="flex items-start justify-between">
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
                                        {incident.severity}
                                    </span>
                                    <span className={clsx("px-2 py-0.5 rounded-sm text-xs font-mono border uppercase",
                                        getStatusColor(incident.status)
                                    )}>
                                        {incident.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-sm text-sm font-medium hover:bg-emerald-500/20 transition-all">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Resolve</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all">
                                <User className="h-4 w-4" />
                                <span>Reassign</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
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
                                    <p className="text-white font-mono">{incident.createdAt}</p>
                                </div>
                                {incident.resolvedAt && (
                                    <div>
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Resolved</p>
                                        <p className="text-white font-mono">{incident.resolvedAt}</p>
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
        </div>
    );
};

export default IncidentDetailsPage;
