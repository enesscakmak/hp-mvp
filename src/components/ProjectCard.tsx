import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, GitCommit, Clock, Activity, Rocket, Eye, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'healthy' | 'warning' | 'down';
    lastDeploy: string;
    framework: 'react' | 'node' | 'python' | 'go';
    repoUrl?: string;
}

interface ProjectCardProps {
    project: Project;
    onDeploy?: () => void;
}

const statusColors = {
    healthy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    down: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const frameworkColors = {
    react: 'text-blue-400',
    node: 'text-green-400',
    python: 'text-yellow-400',
    go: 'text-cyan-400',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDeploy }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleDeploy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onDeploy) {
            onDeploy();
        } else {
            // Fallback if no handler provided (e.g. on other pages)
            navigate(`/projects/${project.id}`);
        }

        setIsMenuOpen(false);
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/projects/${project.id}`);
        setIsMenuOpen(false);
    };

    const handleSettings = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Navigate to project settings tab
        navigate(`/projects/${project.id}`, { state: { activeTab: 'settings' } });
        setIsMenuOpen(false);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.right + window.scrollX - 192 // 192px = w-48
            });
        }

        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Link to={`/projects/${project.id}`} className="block h-full">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 flex flex-col h-full overflow-hidden cursor-pointer"
            >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={clsx("h-2 w-2 rounded-full",
                            project.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                project.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                    'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        )} />
                        <h3 className="text-lg font-bold text-white tracking-tight">{project.name}</h3>
                    </div>
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={handleMenuToggle}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {isMenuOpen && createPortal(
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    transition={{ duration: 0.1 }}
                                    style={{
                                        position: 'fixed',
                                        top: `${menuPosition.top}px`,
                                        left: `${menuPosition.left}px`,
                                        backgroundColor: 'rgb(24, 24, 27)',
                                        zIndex: 9999
                                    }}
                                    className="w-48 border border-zinc-700 rounded-sm shadow-2xl overflow-hidden"
                                >
                                    <button
                                        onClick={handleDeploy}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <Rocket className="h-4 w-4" />
                                        <span>Deploy</span>
                                    </button>
                                    <button
                                        onClick={handleViewDetails}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View Details</span>
                                    </button>
                                    <button
                                        onClick={handleSettings}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </motion.div>
                            </AnimatePresence>,
                            document.body
                        )}
                    </div>
                </div>

                <p className="text-zinc-400 text-sm mb-6 flex-1 relative z-10 line-clamp-2">
                    {project.description}
                </p>

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                        <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3" />
                            <span className={clsx("px-1.5 py-0.5 rounded-sm border uppercase", statusColors[project.status])}>
                                {project.status}
                            </span>
                        </div>
                        <span className={clsx("uppercase", frameworkColors[project.framework])}>
                            {project.framework}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(project.lastDeploy)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GitCommit className="h-3 w-3" />
                            <span>master</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
