import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    GitCommit,
    Github,
    RotateCcw,
    ExternalLink,
    Terminal,
    Activity
} from 'lucide-react';
import { clsx } from 'clsx';

const DeploymentDetailsPage: React.FC = () => {
    const { deploymentId } = useParams();
    const [activeTab, setActiveTab] = useState<'logs' | 'timeline'>('logs');

    // Mock deployment data - different scenarios based on ID
    const getMockDeployment = (id: string | undefined) => {
        // Building deployment (dep-2)
        if (id === 'dep-2') {
            return {
                id,
                project: 'frontend-dashboard',
                environment: 'preview' as const,
                status: 'building' as const,
                commitHash: 'e5f6g7h',
                commitMessage: 'fix: modal positioning issue',
                author: 'antigravity',
                timestamp: 'Just now',
                duration: 'Running...',
                branch: 'fix/modal-position',
                triggeredBy: 'GitHub Actions',
                logs: [
                    { time: '00:00', level: 'info', message: 'Starting deployment...' },
                    { time: '00:01', level: 'info', message: 'Pulling latest code from fix/modal-position branch' },
                    { time: '00:03', level: 'info', message: 'Installing dependencies...' },
                    { time: '00:15', level: 'info', message: 'Running build process...' },
                    { time: '00:30', level: 'info', message: 'Build in progress...' },
                ],
                timeline: [
                    { step: 'Queued', status: 'completed' as const, duration: '1s' },
                    { step: 'Building', status: 'in-progress' as const, duration: '30s+' },
                    { step: 'Testing', status: 'pending' as const, duration: '-' },
                    { step: 'Deploying', status: 'pending' as const, duration: '-' },
                    { step: 'Health Check', status: 'pending' as const, duration: '-' },
                ]
            };
        }

        // Failed deployment (dep-3)
        if (id === 'dep-3') {
            return {
                id,
                project: 'payment-gateway',
                environment: 'production' as const,
                status: 'failed' as const,
                commitHash: 'i8j9k0l',
                commitMessage: 'chore: update stripe api version',
                author: 'alex',
                timestamp: '5h ago',
                duration: '1m 20s',
                branch: 'main',
                triggeredBy: 'GitHub Actions',
                logs: [
                    { time: '00:00', level: 'info', message: 'Starting deployment...' },
                    { time: '00:01', level: 'info', message: 'Pulling latest code from main branch' },
                    { time: '00:03', level: 'info', message: 'Installing dependencies...' },
                    { time: '00:15', level: 'info', message: 'Running build process...' },
                    { time: '00:45', level: 'info', message: 'Build completed successfully' },
                    { time: '00:47', level: 'info', message: 'Running tests...' },
                    { time: '01:05', level: 'error', message: 'Test failed: stripe_api_integration_test' },
                    { time: '01:06', level: 'error', message: 'Error: Invalid API key format' },
                    { time: '01:20', level: 'error', message: 'Deployment failed - rolling back changes' },
                ],
                timeline: [
                    { step: 'Queued', status: 'completed' as const, duration: '1s' },
                    { step: 'Building', status: 'completed' as const, duration: '42s' },
                    { step: 'Testing', status: 'failed' as const, duration: '18s' },
                    { step: 'Deploying', status: 'pending' as const, duration: '-' },
                    { step: 'Health Check', status: 'pending' as const, duration: '-' },
                ]
            };
        }

        // Default successful deployment (dep-1 or any other)
        return {
            id: id || 'dep-1',
            project: 'auth-service',
            environment: 'production' as const,
            status: 'success' as const,
            commitHash: 'a1b2c3d',
            commitMessage: 'feat: implement OIDC provider',
            author: 'enes',
            timestamp: '2h ago',
            duration: '45s',
            branch: 'main',
            triggeredBy: 'GitHub Actions',
            logs: [
                { time: '00:00', level: 'info', message: 'Starting deployment...' },
                { time: '00:01', level: 'info', message: 'Pulling latest code from main branch' },
                { time: '00:03', level: 'info', message: 'Installing dependencies...' },
                { time: '00:15', level: 'info', message: 'Running build process...' },
                { time: '00:30', level: 'info', message: 'Build completed successfully' },
                { time: '00:32', level: 'info', message: 'Running tests...' },
                { time: '00:38', level: 'success', message: 'All tests passed (24/24)' },
                { time: '00:40', level: 'info', message: 'Deploying to production...' },
                { time: '00:43', level: 'info', message: 'Health check passed' },
                { time: '00:45', level: 'success', message: 'Deployment completed successfully' },
            ],
            timeline: [
                { step: 'Queued', status: 'completed' as const, duration: '1s' },
                { step: 'Building', status: 'completed' as const, duration: '30s' },
                { step: 'Testing', status: 'completed' as const, duration: '8s' },
                { step: 'Deploying', status: 'completed' as const, duration: '5s' },
                { step: 'Health Check', status: 'completed' as const, duration: '1s' },
            ]
        };
    };

    const deployment = getMockDeployment(deploymentId);


    const getStatusIcon = (status: 'success' | 'failed' | 'building' | 'queued') => {
        switch (status) {
            case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'failed': return <XCircle className="h-5 w-5 text-rose-500" />;
            case 'building': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            default: return <Clock className="h-5 w-5 text-zinc-500" />;
        }
    };

    const getStatusColor = (status: 'success' | 'failed' | 'building' | 'queued') => {
        switch (status) {
            case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'building': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
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
                <div className="max-w-7xl mx-auto px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/deployments" className="hover:text-white transition-colors">Deployments</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{deployment.project}</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{deployment.commitHash}</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={clsx("p-3 rounded-sm bg-zinc-900 border border-zinc-800")}>
                                {getStatusIcon(deployment.status)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                    {deployment.project}
                                    <span className={clsx("px-2 py-0.5 rounded-sm text-xs font-mono border uppercase",
                                        deployment.environment === 'production' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            deployment.environment === 'staging' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    )}>
                                        {deployment.environment}
                                    </span>
                                    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-mono border uppercase",
                                        getStatusColor(deployment.status)
                                    )}>
                                        {deployment.status}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-zinc-400 mt-2">
                                    <div className="flex items-center gap-2">
                                        <GitCommit className="h-3 w-3" />
                                        <span className="font-mono text-zinc-500">{deployment.commitHash}</span>
                                        <span className="text-zinc-300">{deployment.commitMessage}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{deployment.timestamp}</span>
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
                    <div className="flex items-center gap-1 mt-8 -mb-6">
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
            <div className="max-w-7xl mx-auto px-8 py-8">
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
                                {deployment.logs.map((log, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <span className="text-zinc-600 select-none">{log.time}</span>
                                        <span className={clsx("flex-1", getLogColor(log.level))}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))}
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

                            {deployment.timeline.map((step, index) => (
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
                                        {index < deployment.timeline.length - 1 && (
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
                                        deployment.status === 'success' ? "bg-emerald-500/30" :
                                            deployment.status === 'failed' ? "bg-rose-500/30" :
                                                "bg-zinc-800"
                                    )} />
                                    <div className={clsx("h-10 w-10 rounded-full border-2 flex items-center justify-center",
                                        deployment.status === 'success' ? "bg-emerald-500/10 border-emerald-500" :
                                            deployment.status === 'failed' ? "bg-rose-500/10 border-rose-500" :
                                                deployment.status === 'building' ? "bg-blue-500/10 border-blue-500 animate-pulse" :
                                                    "bg-zinc-900 border-zinc-700"
                                    )}>
                                        {deployment.status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                        {deployment.status === 'failed' && <XCircle className="h-5 w-5 text-rose-500" />}
                                        {deployment.status === 'building' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                                    </div>
                                </div>
                                <div className="flex-1 pt-2">
                                    <p className={clsx("text-sm font-mono uppercase font-medium",
                                        deployment.status === 'success' ? "text-emerald-400" :
                                            deployment.status === 'failed' ? "text-rose-400" :
                                                deployment.status === 'building' ? "text-blue-400" :
                                                    "text-zinc-400"
                                    )}>
                                        {deployment.status === 'success' && 'Deployment Completed Successfully'}
                                        {deployment.status === 'failed' && 'Deployment Failed'}
                                        {deployment.status === 'building' && 'Deployment In Progress'}
                                        {deployment.status === 'queued' && 'Deployment Queued'}
                                    </p>
                                    {deployment.status === 'success' && (
                                        <p className="text-xs text-zinc-500 mt-1">Total duration: {deployment.duration}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default DeploymentDetailsPage;
