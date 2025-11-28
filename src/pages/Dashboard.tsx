import React, { useEffect, useState } from 'react';
import { FolderKanban, Rocket, AlertTriangle, CheckSquare, Activity, Terminal, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TriggerDeploymentModal from '../components/TriggerDeploymentModal';
import { projectService } from '../services/projectService';
import { getDeployments } from '../services/deploymentService';
import { getIncidents } from '../services/incidentService';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);
    interface DashboardStats {
        projectCount: number;
        deploymentCount: number;
        incidentCount: number;
        openIncidentCount: number;
        healthScore: number;
        systemLoad: number;
        latency: number;
        errorRate: number;
    }

    const [stats, setStats] = useState<DashboardStats>({
        projectCount: 0,
        deploymentCount: 0,
        incidentCount: 0,
        openIncidentCount: 0,
        healthScore: 100,
        systemLoad: 10,
        latency: 0,
        errorRate: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        const start = performance.now();
        try {
            const [projects, deployments, incidents] = await Promise.all([
                projectService.getProjects(),
                getDeployments(),
                getIncidents()
            ]);
            const end = performance.now();
            const latency = Math.round(end - start);

            // Calculate health score based on project status
            let health = 100;
            const downProjects = projects.filter(p => p.status === 'down').length;
            const warningProjects = projects.filter(p => p.status === 'warning').length;

            if (downProjects > 0) health -= (downProjects * 20);
            if (warningProjects > 0) health -= (warningProjects * 5);

            health = Math.max(0, health); // Ensure not negative

            // Calculate system load based on active deployments
            const activeDeployments = deployments.filter(d => d.status === 'building' || d.status === 'queued').length;
            const systemLoad = Math.min(100, 10 + (activeDeployments * 25));

            // Calculate error rate
            const failedDeployments = deployments.filter(d => d.status === 'failed').length;
            const errorRate = deployments.length > 0 ? (failedDeployments / deployments.length) * 100 : 0;

            setStats({
                projectCount: projects.length,
                deploymentCount: deployments.length,
                incidentCount: incidents.length,
                openIncidentCount: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length,
                healthScore: health,
                systemLoad,
                latency,
                errorRate
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
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
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
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
                        <p className="text-white font-mono">{new Date().toLocaleTimeString()}</p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Projects"
                        value={stats.projectCount.toString()}
                        trend=""
                        trendUp={true}
                        icon={FolderKanban}
                        to="/projects"
                    />
                    <StatCard
                        title="Total Deployments"
                        value={stats.deploymentCount.toString()}
                        trend=""
                        trendUp={true}
                        icon={Rocket}
                        to="/deployments"
                    />
                    <StatCard
                        title="Open Incidents"
                        value={stats.openIncidentCount.toString()}
                        trend=""
                        trendUp={false}
                        icon={AlertTriangle}
                        to="/incidents"
                    />
                    <StatCard
                        title="Total Incidents"
                        value={stats.incidentCount.toString()}
                        trend=""
                        trendUp={true}
                        icon={CheckSquare}
                        to="/incidents"
                    />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-zinc-500" />
                            System Health
                        </h2>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className={clsx("text-2xl font-bold mb-1",
                                        stats.healthScore >= 90 ? "text-emerald-400" :
                                            stats.healthScore >= 70 ? "text-amber-400" : "text-rose-400"
                                    )}>{stats.healthScore}%</div>
                                    <div className="text-xs font-mono text-zinc-500 uppercase">System Health Score</div>
                                </div>
                                <div className={clsx("h-10 w-10 rounded-full flex items-center justify-center border",
                                    stats.healthScore >= 90 ? "bg-emerald-500/10 border-emerald-500/20" :
                                        stats.healthScore >= 70 ? "bg-amber-500/10 border-amber-500/20" : "bg-rose-500/10 border-rose-500/20"
                                )}>
                                    <Activity className={clsx("h-5 w-5",
                                        stats.healthScore >= 90 ? "text-emerald-500" :
                                            stats.healthScore >= 70 ? "text-amber-500" : "text-rose-500"
                                    )} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-zinc-400">API Latency</span>
                                        <span className="text-emerald-400 font-mono">{stats.latency}ms</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (stats.latency / 500) * 100)}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-zinc-400">Error Rate</span>
                                        <span className={clsx("font-mono", stats.errorRate > 5 ? "text-rose-400" : "text-emerald-400")}>
                                            {stats.errorRate.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                        <div className={clsx("h-full", stats.errorRate > 5 ? "bg-rose-500" : "bg-emerald-500")}
                                            style={{ width: `${Math.max(2, Math.min(100, stats.errorRate))}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-zinc-400">System Load</span>
                                        <span className="text-blue-400 font-mono">{stats.systemLoad}%</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${stats.systemLoad}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-zinc-500" />
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => setIsDeployModalOpen(true)}
                                className="p-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all rounded-sm text-left group"
                            >
                                <Rocket className="h-5 w-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                <span className="text-xs font-mono text-zinc-400 group-hover:text-white block">NEW DEPLOY</span>
                            </button>
                            <button
                                onClick={() => navigate('/incidents')}
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
        </div>
    );
};

export default Dashboard;
