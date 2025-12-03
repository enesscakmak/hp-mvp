import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, Activity, Terminal, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { getIncidentsByDeploymentId, Incident, getSeverityString, getStatusString } from '../services/incidentService';
import ChecklistSection from '../features/checklists/components/ChecklistSection';
import { getDeploymentById, Deployment } from '../services/deploymentService';
import { formatDateTime } from '../utils/dateUtils';
import DeploymentHeader from '../features/deployments/components/DeploymentHeader';
import DeploymentLogs from '../features/deployments/components/DeploymentLogs';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

interface LogEntry {
    time: string;
    level: 'info' | 'error' | 'success' | 'warning';
    message: string;
}

interface TimelineStep {
    step: string;
    status: 'completed' | 'in-progress' | 'pending' | 'failed';
    duration: string;
}

const DeploymentDetailsPage: React.FC = () => {
    const { deploymentId } = useParams();
    const [activeTab, setActiveTab] = useState<'logs' | 'timeline'>('logs');
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [deployment, setDeployment] = useState<Deployment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [timeline, setTimeline] = useState<TimelineStep[]>([]);

    useEffect(() => {
        if (deploymentId) {
            loadData(deploymentId);
        }
    }, [deploymentId]);

    const loadData = async (id: string) => {
        try {
            const [depData, incData] = await Promise.all([
                getDeploymentById(id),
                getIncidentsByDeploymentId(id)
            ]);

            if (depData) {
                setDeployment(depData);
                try {
                    setLogs(JSON.parse(depData.logsJson || '[]'));
                    setTimeline(JSON.parse(depData.timelineJson || '[]'));
                } catch (e) {
                    console.error('Failed to parse JSON data', e);
                }
            }
            setIncidents(incData);
        } catch (error) {
            console.error('Failed to load deployment details', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (!deployment) return <div className="min-h-screen bg-zinc-950 text-white p-8">Deployment not found</div>;

    const tabs = [
        { id: 'logs', label: 'Build Logs', icon: Terminal },
        { id: 'timeline', label: 'Timeline', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <DeploymentHeader deployment={deployment} />

            {/* Tabs Navigation (Sticky below header) */}
            <div className="bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800 sticky top-[137px] z-10 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                                activeTab === tab.id
                                    ? "border-white text-white"
                                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'logs' && (
                        <DeploymentLogs logs={logs} />
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            {/* Start Marker */}
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-zinc-500" />
                                    </div>
                                    <div className="w-0.5 h-16 bg-zinc-800 mt-2" />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-sm font-mono text-zinc-500 uppercase">Deployment Started</p>
                                </div>
                            </div>

                            {timeline.map((step, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={clsx("h-8 w-8 rounded-full border-2 flex items-center justify-center",
                                            step.status === 'completed' ? "bg-emerald-500/10 border-emerald-500" :
                                                step.status === 'in-progress' ? "bg-blue-500/10 border-blue-500 animate-pulse" :
                                                    step.status === 'failed' ? "bg-rose-500/10 border-rose-500" :
                                                        "bg-zinc-900 border-zinc-700"
                                        )}>
                                            {step.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                            {step.status === 'in-progress' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                                            {step.status === 'failed' && <XCircle className="h-4 w-4 text-rose-500" />}
                                        </div>
                                        {index < timeline.length - 1 && (
                                            <div className={clsx("w-0.5 h-16 mt-2",
                                                step.status === 'completed' ? "bg-emerald-500/30" :
                                                    step.status === 'in-progress' ? "bg-blue-500/30" :
                                                        step.status === 'failed' ? "bg-rose-500/30" :
                                                            "bg-zinc-800"
                                            )} />
                                        )}
                                    </div>
                                    <Card className="flex-1 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-white">{step.step}</h3>
                                            <span className="text-sm text-zinc-500 font-mono">{step.duration}</span>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                            {/* End Marker */}
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={clsx("w-0.5 h-4",
                                        deployment.status === 1 ? "bg-emerald-500/30" :
                                            deployment.status === 2 ? "bg-rose-500/30" :
                                                "bg-zinc-800"
                                    )} />
                                    <div className={clsx("h-10 w-10 rounded-full border-2 flex items-center justify-center",
                                        deployment.status === 1 ? "bg-emerald-500/10 border-emerald-500" :
                                            deployment.status === 2 ? "bg-rose-500/10 border-rose-500" :
                                                deployment.status === 0 ? "bg-blue-500/10 border-blue-500 animate-pulse" :
                                                    "bg-zinc-900 border-zinc-700"
                                    )}>
                                        {deployment.status === 1 && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                        {deployment.status === 2 && <XCircle className="h-5 w-5 text-rose-500" />}
                                        {deployment.status === 0 && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                                    </div>
                                </div>
                                <div className="flex-1 pt-2">
                                    <p className={clsx("text-sm font-mono uppercase font-medium",
                                        deployment.status === 1 ? "text-emerald-400" :
                                            deployment.status === 2 ? "text-rose-400" :
                                                deployment.status === 0 ? "text-blue-400" :
                                                    "text-zinc-400"
                                    )}>
                                        {deployment.status === 1 && 'Deployment Completed Successfully'}
                                        {deployment.status === 2 && 'Deployment Failed'}
                                        {deployment.status === 0 && 'Deployment In Progress'}
                                        {deployment.status === 3 && 'Deployment Queued'}
                                    </p>
                                    {deployment.status === 1 && (
                                        <p className="text-xs text-zinc-500 mt-1">Total duration: {deployment.duration}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Checklists Section */}
                <div className="mt-8">
                    <ChecklistSection targetId={deployment.id.toString()} targetType="deployment" />
                </div>

                {/* Incidents Section */}
                {incidents.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-400" />
                            Related Incidents ({incidents.length})
                        </h2>
                        <div className="space-y-3">
                            {incidents.map((incident) => (
                                <Link
                                    key={incident.id}
                                    to={`/incidents/${incident.id}`}
                                    className="block group"
                                >
                                    <Card className="p-4 hover:bg-zinc-900/50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{incident.title}</h3>
                                                    <Badge
                                                        variant={
                                                            getSeverityString(incident.severity) === 'critical' ? 'error' :
                                                                getSeverityString(incident.severity) === 'high' ? 'warning' :
                                                                    getSeverityString(incident.severity) === 'medium' ? 'warning' :
                                                                        'neutral'
                                                        }
                                                        size="sm"
                                                        className="uppercase"
                                                    >
                                                        {getSeverityString(incident.severity)}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            getStatusString(incident.status) === 'resolved' || getStatusString(incident.status) === 'closed' ? 'success' :
                                                                getStatusString(incident.status) === 'investigating' ? 'info' :
                                                                    'neutral'
                                                        }
                                                        size="sm"
                                                        className="uppercase"
                                                    >
                                                        {getStatusString(incident.status)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-zinc-400">{incident.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-mono">
                                                    <span>Created {formatDateTime(incident.createdAt)}</span>
                                                    {incident.resolvedAt && <span>• Resolved {formatDateTime(incident.resolvedAt)}</span>}
                                                    {incident.assignedTo && <span>• Assigned to {incident.assignedTo}</span>}
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeploymentDetailsPage;
