import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Rocket, CheckCircle2, XCircle, Loader2, Clock, GitCommit, AlertTriangle, Github, RotateCcw, Terminal, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { getIncidentsByDeploymentId, Incident, getSeverityString, getStatusString } from '../services/incidentService';
import ChecklistSection from '../components/ChecklistSection';
import { getDeploymentById, Deployment } from '../services/deploymentService';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

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

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 1: return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 2: return <XCircle className="h-5 w-5 text-rose-500" />;
            case 0: return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            default: return <Clock className="h-5 w-5 text-zinc-500" />;
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 2: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 0: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1: return 'success';
            case 2: return 'failed';
            case 0: return 'building';
            default: return 'queued';
        }
    };

    const getLogColor = (level: string) => {
        switch (level) {
            case 'success': return 'text-emerald-400';
            case 'error': return 'text-rose-400';
            case 'warning': return 'text-amber-400';
            default: return 'text-zinc-400';
        }
    };

    const tabs = [
        { id: 'logs', label: 'Build Logs', icon: Terminal },
        { id: 'timeline', label: 'Timeline', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/deployments" className="hover:text-white transition-colors">Deployments</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{deployment.projectName}</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{deployment.commitHash}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={clsx("p-3 rounded-sm bg-zinc-900 border border-zinc-800")}>
                                {getStatusIcon(deployment.status)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                    {deployment.projectName}
                                    <span className={clsx("px-2 py-0.5 rounded-sm text-xs font-mono border uppercase",
                                        deployment.environment.toLowerCase() === 'production' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            deployment.environment.toLowerCase() === 'staging' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    )}>
                                        {deployment.environment}
                                    </span>
                                    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-mono border uppercase",
                                        getStatusColor(deployment.status)
                                    )}>
                                        {getStatusText(deployment.status)}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-zinc-400 mt-2">
                                    <div className="flex items-center gap-2">
                                        <GitCommit className="h-3 w-3" />
                                        <span className="font-mono text-zinc-500">{deployment.commitHash}</span>
                                        <span className="text-zinc-300">{deployment.commitMessage}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{formatTimeAgo(deployment.deployedAt)}</span>
                                    <span>•</span>
                                    <span>{deployment.duration}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all">
                                <Github className="h-4 w-4" />
                                <span>View Commit</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all">
                                <RotateCcw className="h-4 w-4" />
                                <span>Rollback</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mt-8 -mb-6 overflow-x-auto no-scrollbar pb-1">
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
                                    <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-sm p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-white">{step.step}</h3>
                                            <span className="text-sm text-zinc-500 font-mono">{step.duration}</span>
                                        </div>
                                    </div>
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
                                    className="block bg-zinc-900/30 border border-zinc-800 rounded-sm p-4 hover:bg-zinc-900/50 transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{incident.title}</h3>
                                                <span className={clsx("text-xs px-1.5 py-0.5 rounded-sm uppercase font-mono",
                                                    getSeverityString(incident.severity) === 'critical' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                                        getSeverityString(incident.severity) === 'high' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                                            getSeverityString(incident.severity) === 'medium' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                                "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                                )}>
                                                    {getSeverityString(incident.severity)}
                                                </span>
                                                <span className={clsx("text-xs px-1.5 py-0.5 rounded-sm uppercase font-mono",
                                                    getStatusString(incident.status) === 'resolved' || getStatusString(incident.status) === 'closed' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                        getStatusString(incident.status) === 'investigating' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                            "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                                )}>
                                                    {getStatusString(incident.status)}
                                                </span>
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
