import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TriggerDeploymentModal from '../components/TriggerDeploymentModal';
import { getDeployments, Deployment } from '../services/deploymentService';
import {
    Rocket,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    GitCommit,
    ExternalLink,
    Loader2,
    ChevronDown,
    AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';

const DeploymentsPage: React.FC = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'building'>('all');
    const [filterEnv, setFilterEnv] = useState<'all' | 'production' | 'staging' | 'preview'>('all');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        loadDeployments();
    }, [refreshKey]);

    const loadDeployments = async () => {
        setIsLoading(true);
        try {
            const data = await getDeployments();
            setDeployments(data);
        } catch (error) {
            console.error('Failed to load deployments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setIsStatusDropdownOpen(false);
            setIsEnvDropdownOpen(false);
        };

        if (isStatusDropdownOpen || isEnvDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isStatusDropdownOpen, isEnvDropdownOpen]);

    const filteredDeployments = deployments.filter(dep => {
        const matchesSearch = dep.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dep.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dep.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || dep.status === filterStatus;
        const matchesEnv = filterEnv === 'all' || dep.environment === filterEnv;
        return matchesSearch && matchesStatus && matchesEnv;
    });

    const getStatusIcon = (status: Deployment['status']) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'failed': return <XCircle className="h-4 w-4 text-rose-500" />;
            case 'building': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'queued': return <Clock className="h-4 w-4 text-zinc-500" />;
        }
    };

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Deployments</h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            GLOBAL_DEPLOYMENT_HISTORY
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
                            <span className="text-emerald-500">●</span> Live System Status: Normal
                        </div>
                        <button
                            onClick={() => setIsDeployModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
                        >
                            <Rocket className="h-4 w-4" />
                            <span>New Deployment</span>
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search deployments, commits, authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Status Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                                    setIsEnvDropdownOpen(false);
                                }}
                                className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-3 pr-4 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all min-w-[140px] justify-between"
                            >
                                <span className="capitalize">{filterStatus === 'all' ? 'All Status' : filterStatus}</span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", isStatusDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isStatusDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl z-50 overflow-hidden"
                                    >
                                        {['all', 'success', 'failed', 'building'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status as any);
                                                    setIsStatusDropdownOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 text-sm transition-colors",
                                                    filterStatus === status ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                                )}
                                            >
                                                <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Environment Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEnvDropdownOpen(!isEnvDropdownOpen);
                                    setIsStatusDropdownOpen(false);
                                }}
                                className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-3 pr-4 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all min-w-[160px] justify-between"
                            >
                                <span className="capitalize">{filterEnv === 'all' ? 'All Environments' : filterEnv}</span>
                                <ChevronDown className={clsx("h-4 w-4 transition-transform", isEnvDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isEnvDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl z-50 overflow-hidden"
                                    >
                                        {['all', 'production', 'staging', 'preview'].map((env) => (
                                            <button
                                                key={env}
                                                onClick={() => {
                                                    setFilterEnv(env as any);
                                                    setIsEnvDropdownOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 text-sm transition-colors",
                                                    filterEnv === env ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                                )}
                                            >
                                                <span className="capitalize">{env === 'all' ? 'All Environments' : env}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Deployments List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {filteredDeployments.map((dep, index) => (
                                <Link key={dep.id} to={`/deployments/${dep.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-zinc-900/30 border border-zinc-800 rounded-sm p-4 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                            {/* Left: Status & Project Info */}
                                            <div className="flex items-start gap-4">
                                                <div className={clsx("mt-1 p-2 rounded-full bg-zinc-900 border border-zinc-800",
                                                    dep.status === 'building' && "animate-pulse"
                                                )}>
                                                    {getStatusIcon(dep.status)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-white font-medium">{dep.project}</h3>
                                                        <span className="text-zinc-600 text-xs">•</span>
                                                        <span className={clsx("text-xs px-1.5 py-0.5 rounded-sm uppercase font-mono",
                                                            dep.environment === 'production' ? "bg-purple-500/10 text-purple-400" :
                                                                dep.environment === 'staging' ? "bg-amber-500/10 text-amber-400" :
                                                                    "bg-blue-500/10 text-blue-400"
                                                        )}>
                                                            {dep.environment}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                        <GitCommit className="h-3 w-3" />
                                                        <span className="font-mono text-zinc-500">{dep.commitHash}</span>
                                                        <span className="text-zinc-300">{dep.commitMessage}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Meta Info */}
                                            <div className="flex items-center gap-6 text-sm text-zinc-500 font-mono">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-300 uppercase">
                                                        {dep.author.substring(0, 2)}
                                                    </div>
                                                    <span>{dep.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{dep.timestamp}</span>
                                                </div>
                                                <div className="w-20 text-right">
                                                    {dep.duration}
                                                </div>
                                                <button className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-500 hover:text-white transition-colors">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>

                                        </div>
                                    </motion.div>
                                </Link>
                            ))}

                            {filteredDeployments.length === 0 && (
                                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                                    <Rocket className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-mono">NO_DEPLOYMENTS_FOUND</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>

            <TriggerDeploymentModal
                isOpen={isDeployModalOpen}
                onClose={() => setIsDeployModalOpen(false)}
                onSuccess={() => {
                    setRefreshKey(prev => prev + 1);
                }}
            />
        </div>
    );
};

export default DeploymentsPage;
