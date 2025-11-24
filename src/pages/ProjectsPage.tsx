import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List, ChevronDown } from 'lucide-react';
import ProjectCard, { Project } from '../components/ProjectCard';
import { clsx } from 'clsx';

// Mock Data
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'auth-service',
        description: 'Centralized authentication and authorization service handling JWT tokens and user sessions.',
        status: 'healthy',
        lastDeploy: '2h ago',
        framework: 'go',
    },
    {
        id: '2',
        name: 'payment-gateway',
        description: 'Stripe integration wrapper for processing recurring subscriptions and one-time payments.',
        status: 'warning',
        lastDeploy: '5m ago',
        framework: 'node',
    },
    {
        id: '3',
        name: 'frontend-dashboard',
        description: 'Main customer-facing dashboard built with React and Vite.',
        status: 'healthy',
        lastDeploy: '1d ago',
        framework: 'react',
    },
    {
        id: '4',
        name: 'data-pipeline',
        description: 'ETL pipeline for processing user analytics and generating daily reports.',
        status: 'down',
        lastDeploy: '3d ago',
        framework: 'python',
    },
    {
        id: '5',
        name: 'notification-worker',
        description: 'Background worker for sending emails and push notifications via SQS.',
        status: 'healthy',
        lastDeploy: '12h ago',
        framework: 'go',
    },
];

const ProjectsPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'warning' | 'down'>('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const filteredProjects = MOCK_PROJECTS.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Projects</h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            MANAGE_MICROSERVICES
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-sm font-medium hover:bg-zinc-200 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-sm p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={clsx("p-1.5 rounded-sm transition-colors", viewMode === 'grid' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={clsx("p-1.5 rounded-sm transition-colors", viewMode === 'list' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-3 pr-4 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all min-w-[140px] justify-between"
                            >
                                <span className="capitalize">{filterStatus === 'all' ? 'All Status' : filterStatus}</span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl z-50 overflow-hidden"
                                    >
                                        {['all', 'healthy', 'warning', 'down'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status as any);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                                                    filterStatus === status ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                                )}
                                            >
                                                {status !== 'all' && (
                                                    <div className={clsx("h-1.5 w-1.5 rounded-full",
                                                        status === 'healthy' ? 'bg-emerald-500' :
                                                            status === 'warning' ? 'bg-amber-500' :
                                                                'bg-rose-500'
                                                    )} />
                                                )}
                                                <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className={clsx(
                        "grid gap-6",
                        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}
                >
                    {filteredProjects.map((project) => (
                        <motion.div key={project.id} variants={item}>
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </motion.div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                        <p className="text-zinc-500 font-mono">NO_PROJECTS_FOUND</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProjectsPage;
