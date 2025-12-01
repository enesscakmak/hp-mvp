import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
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
    Github,
    Loader2,
    Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';
import StatCard from '../components/StatCard';
import { projectService } from '../services/projectService';
import { getDeployments, Deployment } from '../services/deploymentService';
import { getIncidents, Incident, getSeverityString, getStatusString } from '../services/incidentService';
import { Project } from '../components/ProjectCard';
import TriggerDeploymentModal from '../components/TriggerDeploymentModal';


const ProjectDetailsPage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'incidents' | 'settings'>('overview');

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        repoUrl: ''
    });

    useEffect(() => {
        if (projectId) {
            loadProject(projectId);
        }
    }, [projectId]);

    const loadProject = async (id: string) => {
        try {
            const [projectData, deploymentsData, incidentsData] = await Promise.all([
                projectService.getProjectById(id),
                getDeployments(),
                getIncidents()
            ]);

            if (projectData) {
                setProject(projectData);
                setFormData({
                    name: projectData.name,
                    description: projectData.description,
                    repoUrl: projectData.repoUrl || ''
                });

                // Filter deployments and incidents for this project
                const projectDeployments = deploymentsData.filter(
                    d => d.projectName === projectData.name
                );
                const projectIncidents = incidentsData.filter(
                    i => i.projectId === projectData.id
                );

                setDeployments(projectDeployments);
                setIncidents(projectIncidents);
            }
        } catch (error) {
            console.error('Failed to load project', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        setIsSaving(true);
        try {
            const updated = await projectService.updateProject(project.id, formData);
            setProject(updated);

            // Scroll to top for visual feedback
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Keep spinner visible for 500ms for better UX feedback
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to update project', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!project || !window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await projectService.deleteProject(project.id);
            navigate('/projects');
        } catch (error) {
            console.error('Failed to delete project', error);
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
                <Link to="/projects" className="text-zinc-500 hover:text-white transition-colors">
                    Return to Projects
                </Link>
            </div>
        );
    }

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
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                        <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{project.name}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <span className="text-lg font-bold text-zinc-400 uppercase">{project.name.substring(0, 2)}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                    {project.name}
                                    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-mono border uppercase",
                                        project.status === 'healthy' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            project.status === 'warning' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    )}>
                                        {project.status}
                                    </span>
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {project.repoUrl && (
                                <a
                                    href={`https://${project.repoUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                                >
                                    <Github className="h-4 w-4" />
                                    <span>Repo</span>
                                </a>
                            )}
                            <button
                                onClick={() => setIsDeployModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-sm text-sm font-medium hover:bg-zinc-200 transition-colors"
                            >
                                <Rocket className="h-4 w-4" />
                                <span>Deploy</span>
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
                    {activeTab === 'overview' && (
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
                    )}

                    {activeTab === 'deployments' && (
                        <div className="space-y-4">
                            {deployments.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                                    <Rocket className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white">No Deployments Yet</h3>
                                    <p className="text-zinc-500 mt-2">Deployments for this project will appear here.</p>
                                </div>
                            ) : (
                                deployments.map((deployment) => (
                                    <Link
                                        key={deployment.id}
                                        to={`/deployments/${deployment.id}`}
                                        className="block bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-sm p-4 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono text-white">{deployment.version}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-sm font-mono ${deployment.status === 1
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : deployment.status === 2
                                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                        {deployment.status === 1 ? 'Success' : deployment.status === 2 ? 'Failed' : 'Pending'}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 font-mono">{deployment.environment}</span>
                                                </div>
                                                <p className="text-sm text-zinc-400">{deployment.notes || 'No notes'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500 font-mono">{formatTimeAgo(deployment.deployedAt)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'incidents' && (
                        <div className="space-y-4">
                            {incidents.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                                    <AlertTriangle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white">No Incidents</h3>
                                    <p className="text-zinc-500 mt-2">Incidents for this project will appear here.</p>
                                </div>
                            ) : (
                                incidents.map((incident) => {
                                    const getSeverityColor = (severity: number) => {
                                        switch (severity) {
                                            case 0: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                                            case 1: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                            case 2: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                                            case 3: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                                            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                                        }
                                    };

                                    const getStatusColor = (status: number) => {
                                        switch (status) {
                                            case 0: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                            case 1: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                                            case 2: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                            case 3: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                                            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                                        }
                                    };

                                    return (
                                        <Link
                                            key={incident.id}
                                            to={`/incidents/${incident.id}`}
                                            className="block bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-sm p-4 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium text-white">{incident.title}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded-sm border font-mono capitalize ${getSeverityColor(incident.severity)}`}>
                                                            {getSeverityString(incident.severity)}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-sm border font-mono capitalize ${getStatusColor(incident.status)}`}>
                                                            {getStatusString(incident.status)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-400">{incident.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-zinc-500 font-mono">{formatTimeAgo(incident.createdAt)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl">
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Project Settings</h3>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Project Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Repository URL</label>
                                        <input
                                            type="text"
                                            value={formData.repoUrl}
                                            onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                            placeholder="github.com/org/repo"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="px-4 py-2 bg-rose-500/10 text-rose-400 font-medium rounded-sm hover:bg-rose-500/20 transition-colors flex items-center gap-2"
                                        >
                                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            Delete Project
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                        >
                                            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <TriggerDeploymentModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                onSuccess={() => {
                    // Optionally navigate to deployments page
                    window.location.href = '/deployments';
                }}
                preselectedProject={project?.name}
            />
        </div>
    );
};

export default ProjectDetailsPage;
