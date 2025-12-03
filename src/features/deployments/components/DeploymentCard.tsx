import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    GitCommit,
    MoreVertical,
    RotateCcw,
    ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { Deployment, rollback } from '../../../services/deploymentService';
import { formatTimeAgo } from '../../../utils/dateUtils';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

interface DeploymentCardProps {
    deployment: Deployment;
    index: number;
    onRollbackSuccess: () => void;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({ deployment, index, onRollbackSuccess }) => {
    const navigate = useNavigate();

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 1: return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 2: return <XCircle className="h-4 w-4 text-rose-500" />;
            case 0: return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            default: return <Clock className="h-4 w-4 text-zinc-500" />;
        }
    };

    const handleRollback = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Are you sure you want to rollback to version ${deployment.version}?`)) return;

        try {
            await rollback(deployment.id);
            toast.success('Rollback started successfully');
            onRollbackSuccess();
        } catch (error) {
            console.error('Rollback failed:', error);
            toast.error('Failed to start rollback');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/deployments/${deployment.id}`)}
            className="group bg-zinc-900/30 border border-zinc-800 rounded-sm p-4 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Left: Status & Project Info */}
                <div className="flex items-start gap-4">
                    <div className={clsx("mt-1 p-2 rounded-full bg-zinc-900 border border-zinc-800",
                        deployment.status === 0 && "animate-pulse"
                    )}>
                        {getStatusIcon(deployment.status)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{deployment.projectName}</h3>
                            <span className="text-zinc-600 text-xs">•</span>
                            <Badge
                                variant={
                                    deployment.environment.toLowerCase() === 'production' ? 'purple' :
                                        deployment.environment.toLowerCase() === 'staging' ? 'warning' :
                                            'info'
                                }
                                size="sm"
                                className="uppercase"
                            >
                                {deployment.environment}
                            </Badge>
                            {deployment.branch && (
                                <>
                                    <span className="text-zinc-600 text-xs">•</span>
                                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                                        <GitCommit className="h-3 w-3" />
                                        {deployment.branch}
                                    </span>
                                </>
                            )}
                        </div >
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <GitCommit className="h-3 w-3" />
                            <span className="font-mono text-zinc-500">{deployment.commitHash}</span>
                            <span className="text-zinc-300">{deployment.commitMessage}</span>
                        </div>
                    </div >
                </div >

                {/* Right: Meta Info */}
                <div className="flex items-center gap-6 text-sm text-zinc-500 font-mono">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-300 uppercase">
                            {deployment.author.substring(0, 2)}
                        </div>
                        <span>{deployment.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(deployment.deployedAt)}</span>
                    </div >
                    <div className="w-20 text-right">
                        {deployment.duration}
                    </div>

                    {/* Actions Menu */}
                    <div className="relative group/menu">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="text-zinc-500 hover:text-white"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>

                        {/* Dropdown */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                            <button
                                onClick={handleRollback}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Rollback to this
                            </button>
                            <Link
                                to={`/deployments/${deployment.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                View Details
                            </Link>
                        </div>
                    </div>
                </div >

            </div >
        </motion.div >
    );
};

export default DeploymentCard;
