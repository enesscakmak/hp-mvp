import React, { useState, useEffect } from 'react';
import { FolderKanban, Rocket, AlertTriangle, CheckSquare, Activity, Clock, Terminal, Loader2 } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TriggerDeploymentModal from '../features/deployments/components/TriggerDeploymentModal';
import CreateIncidentModal from '../features/incidents/components/CreateIncidentModal';
import { projectService } from '../services/projectService';
import { getDeployments } from '../services/deploymentService';
import { getIncidents } from '../services/incidentService';
import { activityService, Activity as ActivityType } from '../services/activityService';
import { formatTimeAgo } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [stats, setStats] = useState({
        projects: 0,
        deployments: 0,
        incidents: 0,
        avgLatency: 0,
        errorRate: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [projects, deployments, incidents, activityFeed] = await Promise.all([
                projectService.getProjects(),
                getDeployments(),
                getIncidents(),
                activityService.getActivityFeed()
            ]);

            // Calculate stats
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const recentDeployments = deployments.items.filter(d => new Date(d.deployedAt) > oneDayAgo);
            const openIncidents = incidents.items.filter(i => i.status === 0 || i.status === 1);

            // Parse average latency from projects (backend sends as "45ms")
            const latencies = projects
                .map(p => parseInt(p.avgLatency?.replace('ms', '') || '0'))
                .filter(l => !isNaN(l) && l > 0);
            const avgLatency = latencies.length > 0
                ? Math.round(latencies.reduce((sum, l) => sum + l, 0) / latencies.length)
                : 0;

            // Parse average error rate from projects (backend sends as "0.5%")
            const errorRates = projects
                .map(p => parseFloat(p.errorRate?.replace('%', '') || '0'))
                .filter(r => !isNaN(r));
            const avgErrorRate = errorRates.length > 0
                ? (errorRates.reduce((sum, r) => sum + r, 0) / errorRates.length).toFixed(2)
                : '0.00';

            setStats({
                projects: projects.length,
                deployments: recentDeployments.length,
                incidents: openIncidents.length,
                avgLatency,
                errorRate: parseFloat(avgErrorRate)
            });

            setActivities(activityFeed);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'deployment':
                return Rocket;
            case 'incident':
                return AlertTriangle;
            case 'checklist':
                return CheckSquare;
            default:
                return Activity;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'deployment':
                return 'text-blue-400';
            case 'incident':
                return 'text-rose-400';
            case 'checklist':
                return 'text-emerald-400';
            default:
                return 'text-zinc-400';
        }
    };

    const getStatusBadge = (activity: ActivityType) => {
        if (activity.type === 'deployment') {
            const statusMap: { [key: number]: { label: string; color: string } } = {
                0: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                1: { label: 'Running', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                2: { label: 'Success', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                3: { label: 'Failed', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
            };
            const status = statusMap[activity.status as number] || statusMap[0];
            return <span className={`px-2 py-0.5 text-xs font-mono border rounded ${status.color}`}>{status.label}</span>;
        } else if (activity.type === 'incident') {
            const statusMap: { [key: number]: { label: string; color: string } } = {
                0: { label: 'Open', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                1: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                2: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                3: { label: 'Closed', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' }
            };
            const status = statusMap[activity.status as number] || statusMap[0];
            return <span className={`px-2 py-0.5 text-xs font-mono border rounded ${status.color}`}>{status.label}</span>;
        } else if (activity.type === 'checklist') {
            return <span className="px-2 py-0.5 text-xs font-mono border rounded bg-blue-500/10 text-blue-400 border-blue-500/20">{activity.status}</span>;
        }
        return null;
    };

    const handleActivityClick = (activity: ActivityType) => {
        if (activity.type === 'deployment') {
            navigate(`/deployments/${activity.id}`);
        } else if (activity.type === 'incident') {
            navigate(`/incidents/${activity.id}`);
        } else if (activity.type === 'checklist') {
            navigate(`/checklists/run/${activity.id}`);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-zinc-950 min-h-screen text-white">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex items-end justify-between border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Dashboard
                        </h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            SYSTEM_STATUS: <span className="text-emerald-500">OPERATIONAL</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Last Sync</p>
                        <p className="text-white font-mono">{new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC</p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Projects"
                        value={stats.projects.toString()}
                        icon={FolderKanban}
                        to="/projects"
                    />
                    <StatCard
                        title="Deployments (24h)"
                        value={stats.deployments.toString()}
                        icon={Rocket}
                        to="/deployments"
                    />
                    <StatCard
                        title="Open Incidents"
                        value={stats.incidents.toString()}
                        icon={AlertTriangle}
                        to="/incidents"
                    />
                    <StatCard
                        title="Avg Latency"
                        value={`${stats.avgLatency}ms`}
                        icon={Activity}
                        to="/projects"
                    />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-zinc-500" />
                                Live Feed
                            </h2>
                            <button
                                onClick={() => navigate('/deployments')}
                                className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                View All
                            </button>
                        </div>

                        <Card className="overflow-hidden max-h-[500px] overflow-y-auto p-0">
                            {activities.length === 0 ? (
                                <div className="p-4 text-center text-zinc-500 text-sm font-mono">
                                    No recent activity
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-800">
                                    {activities.map((activity, index) => {
                                        const Icon = getActivityIcon(activity.type);
                                        const iconColor = getActivityColor(activity.type);
                                        return (
                                            <div
                                                key={`${activity.type}-${activity.id}-${index}`}
                                                onClick={() => handleActivityClick(activity)}
                                                className="p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 bg-zinc-900 border border-zinc-800 rounded-sm ${iconColor} group-hover:border-zinc-700 transition-colors`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h3 className="text-sm font-medium text-white truncate">{activity.title}</h3>
                                                            {getStatusBadge(activity)}
                                                        </div>
                                                        <p className="text-xs text-zinc-500 truncate mb-2">{activity.description}</p>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatTimeAgo(activity.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    <motion.div variants={item} className="space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-zinc-500" />
                            Quick Actions
                        </h2>

                        <Card className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>Avg Latency</span>
                                    <span>{stats.avgLatency}ms</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(stats.avgLatency / 5, 100)}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>Error Rate</span>
                                    <span>{stats.errorRate}%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(stats.errorRate * 10, 100)}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>Open Incidents</span>
                                    <span>{stats.incidents}</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(stats.incidents * 10, 100)}%` }} />
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsDeployModalOpen(true)}
                                className="p-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all rounded-sm text-left group"
                            >
                                <Rocket className="h-5 w-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                <span className="text-xs font-mono text-zinc-400 group-hover:text-white block">NEW DEPLOY</span>
                            </button>
                            <button
                                onClick={() => setIsIncidentModalOpen(true)}
                                className="p-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all rounded-sm text-left group"
                            >
                                <AlertTriangle className="h-5 w-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                <span className="text-xs font-mono text-zinc-400 group-hover:text-white block">REPORT INCIDENT</span>
                            </button>
                        </div>
                    </motion.div>

                </div>
            </motion.div>

            <TriggerDeploymentModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                onSuccess={() => {
                    loadDashboardData(); // Refresh stats after deployment
                }}
            />

            <CreateIncidentModal
                isOpen={isIncidentModalOpen}
                onClose={() => setIsIncidentModalOpen(false)}
                onSuccess={() => {
                    loadDashboardData(); // Refresh stats after incident creation
                }}
            />
        </div>
    );
};

export default Dashboard;
