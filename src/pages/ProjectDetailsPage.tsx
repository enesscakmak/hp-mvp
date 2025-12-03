import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    Rocket,
    AlertTriangle,
    ChevronRight,
    Loader2,
    Settings,
    LayoutDashboard,
    Github
} from 'lucide-react';

import { clsx } from 'clsx';
import { projectService, Project } from '../services/projectService';
import { getDeployments, Deployment } from '../services/deploymentService';
import { getIncidents, Incident } from '../services/incidentService';
import TriggerDeploymentModal from '../features/deployments/components/TriggerDeploymentModal';
import EnvVarManager from '../features/projects/components/EnvVarManager';

// Feature Components
import ProjectOverviewTab from '../features/projects/components/ProjectOverviewTab';
import ProjectWikiTab from '../features/projects/components/ProjectWikiTab';
import ProjectInfrastructureTab from '../features/projects/components/ProjectInfrastructureTab';
import ProjectSettingsTab from '../features/projects/components/ProjectSettingsTab';
import ProjectDeploymentsTab from '../features/projects/components/ProjectDeploymentsTab';
import ProjectIncidentsTab from '../features/projects/components/ProjectIncidentsTab';

const ProjectDetailsPage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'incidents' | 'settings' | 'wiki' | 'infrastructure' | 'environment'>('overview');

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        if (projectId) {
            loadData(projectId);
        }
    }, [projectId]);

    const loadData = async (id: string) => {
        setIsLoading(true);
        try {
            const [projectData, deploymentsData, incidentsData] = await Promise.all([
                projectService.getProjectById(id),
                getDeployments(),
                getIncidents()
            ]);

            if (projectData) {
                setProject(projectData);

                // Filter deployments and incidents for this project
                const projectDeployments = deploymentsData.items.filter(
                    d => d.projectName === projectData.name
                );
                const projectIncidents = incidentsData.items.filter(
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

    const handleDelete = async () => {
        if (!project) return;
        try {
            await projectService.deleteProject(project.id);
            navigate('/projects');
        } catch (error) {
            console.error('Failed to delete project', error);
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
        { id: 'wiki', label: 'Wiki', icon: Activity },
        { id: 'infrastructure', label: 'Infrastructure', icon: Settings },
        { id: 'environment', label: 'Environment', icon: Settings },
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
                        <ProjectOverviewTab project={project} />
                    )}

                    {activeTab === 'wiki' && (
                        <ProjectWikiTab project={project} onUpdate={setProject} />
                    )}

                    {activeTab === 'infrastructure' && (
                        <ProjectInfrastructureTab projectId={project.id} />
                    )}

                    {activeTab === 'environment' && (
                        <EnvVarManager projectId={project.id} />
                    )}

                    {activeTab === 'deployments' && (
                        <ProjectDeploymentsTab deployments={deployments} />
                    )}

                    {activeTab === 'incidents' && (
                        <ProjectIncidentsTab incidents={incidents} />
                    )}

                    {activeTab === 'settings' && (
                        <ProjectSettingsTab
                            project={project}
                            onUpdate={setProject}
                            onDelete={handleDelete}
                        />
                    )}
                </motion.div>
            </div>

            <TriggerDeploymentModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                onSuccess={() => {
                    window.location.href = '/deployments';
                }}
                preselectedProject={project?.name}
            />
        </div>
    );
};

export default ProjectDetailsPage;
