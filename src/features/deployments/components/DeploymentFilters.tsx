import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface DeploymentFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterStatus: 'all' | 'success' | 'failed' | 'building';
    setFilterStatus: (status: 'all' | 'success' | 'failed' | 'building') => void;
    filterEnv: 'all' | 'production' | 'staging' | 'preview';
    setFilterEnv: (env: 'all' | 'production' | 'staging' | 'preview') => void;
    filterBranch: string;
    setFilterBranch: (branch: string) => void;
    uniqueBranches: string[];
}

const DeploymentFilters: React.FC<DeploymentFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterEnv,
    setFilterEnv,
    filterBranch,
    setFilterBranch,
    uniqueBranches
}) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsStatusDropdownOpen(false);
            setIsEnvDropdownOpen(false);
            setIsBranchDropdownOpen(false);
        };

        if (isStatusDropdownOpen || isEnvDropdownOpen || isBranchDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isStatusDropdownOpen, isEnvDropdownOpen, isBranchDropdownOpen]);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
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
                            setIsBranchDropdownOpen(false);
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
                            setIsBranchDropdownOpen(false);
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

                {/* Branch Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsBranchDropdownOpen(!isBranchDropdownOpen);
                            setIsStatusDropdownOpen(false);
                            setIsEnvDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-3 pr-4 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all min-w-[160px] justify-between"
                    >
                        <span className="truncate max-w-[120px]">{filterBranch === 'all' ? 'All Branches' : filterBranch}</span>
                        <ChevronDown className={clsx("h-4 w-4 transition-transform", isBranchDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isBranchDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                            >
                                <button
                                    onClick={() => {
                                        setFilterBranch('all');
                                        setIsBranchDropdownOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 text-sm transition-colors",
                                        filterBranch === 'all' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                    )}
                                >
                                    All Branches
                                </button>
                                {uniqueBranches.map((branch) => (
                                    <button
                                        key={branch}
                                        onClick={() => {
                                            setFilterBranch(branch);
                                            setIsBranchDropdownOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full text-left px-3 py-2 text-sm transition-colors truncate",
                                            filterBranch === branch ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                        )}
                                    >
                                        {branch}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DeploymentFilters;
