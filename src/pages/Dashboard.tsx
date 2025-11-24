import React from 'react';
import { FolderKanban, Rocket, AlertTriangle, CheckSquare, Activity, Clock, Terminal } from 'lucide-react';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TriggerDeploymentModal from '../components/TriggerDeploymentModal';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);

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
                        <p className="text-white font-mono">10:42:05 UTC</p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Projects"
                        value="12"
                        trend="+2"
                        trendUp={true}
                        icon={FolderKanban}
                        to="/projects"
                    />
                    <StatCard
                        title="Deployments (24h)"
                        value="8"
                        trend="+15%"
                        trendUp={true}
                        icon={Rocket}
                        to="/deployments"
                    />
                    <StatCard
                        title="Open Incidents"
                        value="3"
                        trend="-1"
                        trendUp={false}
                        icon={AlertTriangle}
                        to="/incidents"
                    />
                    <StatCard
                        title="Checklists Run"
                        value="45"
                        trend="+12%"
                        trendUp={true}
                        icon={CheckSquare}
                        to="/checklists"
                    />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Activity Feed */}
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

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm overflow-hidden">
                            {[
                                { type: 'deployment', msg: 'frontend-service deployed to production', time: '2m ago', user: 'alex' },
                                { type: 'incident', msg: 'High latency detected in us-east-1', time: '15m ago', user: 'system' },
                                { type: 'project', msg: 'New microservice "auth-v2" created', time: '1h ago', user: 'sarah' },
                                { type: 'checklist', msg: 'Pre-flight checklist completed for release-123', time: '2h ago', user: 'mike' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors group">
                                    <div className="flex-shrink-0">
                                        {log.type === 'deployment' && <Rocket className="h-4 w-4 text-emerald-500" />}
                                        {log.type === 'incident' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                                        {log.type === 'project' && <FolderKanban className="h-4 w-4 text-blue-500" />}
                                        {log.type === 'checklist' && <CheckSquare className="h-4 w-4 text-amber-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0 font-mono text-sm">
                                        <span className="text-zinc-500 mr-2">[{log.time}]</span>
                                        <span className="text-zinc-300 group-hover:text-white transition-colors">{log.msg}</span>
                                    </div>
                                    <div className="text-xs text-zinc-600 font-mono">
                                        @{log.user}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* System Health / Quick Actions */}
                    <motion.div variants={item} className="space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-zinc-500" />
                            System Health
                        </h2>

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>API Latency</span>
                                    <span>45ms</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[20%] bg-emerald-500 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>Error Rate</span>
                                    <span>0.01%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[2%] bg-emerald-500 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span>Database Load</span>
                                    <span>34%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[34%] bg-blue-500 rounded-full" />
                                </div>
                            </div>
                        </div>

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
                    // Refresh data if needed, or just let the toast handle feedback
                }}
            />
        </div>
    );
};

export default Dashboard;
