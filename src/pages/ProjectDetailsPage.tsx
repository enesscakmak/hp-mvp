import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    Activity,
    GitCommit,
    Clock,
    Rocket,
    AlertTriangle,
    Settings,
    LayoutDashboard,
    ExternalLink,
    Github
} from 'lucide-react';
import { clsx } from 'clsx';
import StatCard from '../components/StatCard';

const ProjectDetailsPage: React.FC = () => {
    const { projectId } = useParams();
    const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'incidents' | 'settings'>('overview');

    // Mock Data (In a real app, fetch based on projectId)
    const project = {
        id: projectId,
        name: 'auth-service',
        description: 'Centralized authentication and authorization service handling JWT tokens and user sessions.',
        status: 'healthy',
        repo: 'github.com/org/auth-service',
        lastDeploy: '2h ago',
        framework: 'go',
        stats: {
            uptime: '99.99%',
            errorRate: '0.01%',
            avgLatency: '45ms',
            activeUsers: '12.5k'
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'deployments', label: 'Deployments', icon: Rocket },
        { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{project.name}</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <span className="text-lg font-bold text-zinc-400 uppercase">{project.name.substring(0, 2)}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                    {project.name}
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20 uppercase">
                                        {project.status}
                                    </span>
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href={`https://${project.repo}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                            >
                                <Github className="h-4 w-4" />
                                <span>Repo</span>
                            </a>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-sm text-sm font-medium hover:bg-zinc-200 transition-colors">
                                <Rocket className="h-4 w-4" />
                                <span>Deploy</span>
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
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard
                                    title="Uptime (30d)"
                                    value={project.stats.uptime}
                                    trend="+0.01%"
                                    trendUp={true}
                                    icon={Activity}
                                />
                                <StatCard
                                    title="Error Rate"
                                    value={project.stats.errorRate}
                                    trend="-0.05%"
                                    trendUp={true}
                                    icon={AlertTriangle}
                                />
                                <StatCard
                                    title="Avg Latency"
                                    value={project.stats.avgLatency}
                                    trend="+2ms"
                                    trendUp={false}
                                    icon={Clock}
                                />
                                <StatCard
                                    title="Active Users"
                                    value={project.stats.activeUsers}
                                    trend="+12%"
                                    trendUp={true}
                                    icon={LayoutDashboard}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                                        <h3 className="text-lg font-bold text-white mb-4">About</h3>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                This service handles all user authentication and authorization logic.
                                                It communicates with the primary PostgreSQL database and Redis for session management.
                                                Recent updates include support for OIDC and improved rate limiting.
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Framework</p>
                                                <p className="text-white font-mono">{project.framework}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Last Deploy</p>
                                                <p className="text-white font-mono">{project.lastDeploy}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="space-y-6">
                                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 transition-colors flex items-center justify-between group">
                                                <span>View Logs</span>
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                            <button className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 transition-colors flex items-center justify-between group">
                                                <span>View Metrics</span>
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                            <button className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 transition-colors flex items-center justify-between group">
                                                <span>API Documentation</span>
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'deployments' && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                            <Rocket className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">Deployments</h3>
                            <p className="text-zinc-500 mt-2">Deployment history and management coming in HM-14.</p>
                        </div>
                    )}

                    {activeTab === 'incidents' && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                            <AlertTriangle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">Incidents</h3>
                            <p className="text-zinc-500 mt-2">Incident tracking and management coming in HM-23.</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl">
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Project Settings</h3>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Project Name</label>
                                        <input type="text" defaultValue={project.name} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                        <textarea rows={3} defaultValue={project.description} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600" />
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800">
                                        <button type="button" className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
