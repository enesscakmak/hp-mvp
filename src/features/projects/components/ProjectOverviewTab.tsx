import React from 'react';
import { Activity, AlertTriangle, Clock, LayoutDashboard, ExternalLink } from 'lucide-react';
import StatCard from '../../../components/ui/StatCard';
import { formatDateTime } from '../../../utils/dateUtils';
import { Project } from '../../../services/projectService';

interface ProjectOverviewTabProps {
    project: Project;
}

const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ project }) => {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Uptime (30d)"
                    value={project.uptime || "0%"}
                    trend="+0.01%"
                    trendUp={true}
                    icon={Activity}
                />
                <StatCard
                    title="Error Rate"
                    value={project.errorRate || "0%"}
                    trend="-0.05%"
                    trendUp={true}
                    icon={AlertTriangle}
                />
                <StatCard
                    title="Avg Latency"
                    value={project.avgLatency || "0ms"}
                    trend="+2ms"
                    trendUp={false}
                    icon={Clock}
                />
                <StatCard
                    title="Active Users"
                    value={project.activeUsers || "0"}
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
                                {project.description}
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Framework</p>
                                <p className="text-white font-mono uppercase">{project.framework}</p>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Last Deploy</p>
                                <p className="text-white font-mono">{formatDateTime(project.lastDeploy)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    // TODO: Implement actual logs view
                                    console.log('View Logs for project:', project.id);
                                    alert('Logs viewer coming soon!');
                                }}
                                className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 hover:text-white transition-colors flex items-center justify-between group"
                            >
                                <span>View Logs</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement actual metrics view
                                    console.log('View Metrics for project:', project.id);
                                    alert('Metrics dashboard coming soon!');
                                }}
                                className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 hover:text-white transition-colors flex items-center justify-between group"
                            >
                                <span>View Metrics</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement actual API docs
                                    console.log('API Documentation for project:', project.id);
                                    alert('API Documentation coming soon!');
                                }}
                                className="w-full text-left px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm text-sm text-zinc-300 hover:text-white transition-colors flex items-center justify-between group"
                            >
                                <span>API Documentation</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverviewTab;
