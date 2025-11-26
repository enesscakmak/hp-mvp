import React, { useEffect, useState } from 'react';
import { FolderKanban, Rocket, AlertTriangle, CheckSquare, Activity, Terminal, Loader2 } from 'lucide-react';
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
    const [stats, setStats] = useState({
        projectCount: 0,
        deploymentCount: 0,
        incidentCount: 0,
        openIncidentCount: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [projects, deployments, incidents] = await Promise.all([
                projectService.getProjects(),
                getDeployments(),
                getIncidents()
            ]);

            setStats({
                projectCount: projects.length,
                deploymentCount: deployments.length,
                incidentCount: incidents.length,
                openIncidentCount: incidents.filter(i => i.status === 'open' || i.status === 'investigating').length
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

                    {/* System Health / Quick Actions */}
                    <motion.div variants={item} className="lg:col-span-3 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-zinc-500" />
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
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
