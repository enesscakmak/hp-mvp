import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    GitCommit,
    Github,
    RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import { Deployment } from '../../../services/deploymentService';
import { formatTimeAgo } from '../../../utils/dateUtils';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

interface DeploymentHeaderProps {
    deployment: Deployment;
}

const DeploymentHeader: React.FC<DeploymentHeaderProps> = ({ deployment }) => {

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 1: return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 2: return <XCircle className="h-5 w-5 text-rose-500" />;
            case 0: return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            default: return <Clock className="h-5 w-5 text-zinc-500" />;
        }
    };



    const getStatusText = (status: number) => {
        switch (status) {
            case 1: return 'success';
            case 2: return 'failed';
            case 0: return 'building';
            default: return 'queued';
        }
    };

    return (
        <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                    <Link to="/deployments" className="hover:text-white transition-colors">Deployments</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{deployment.projectName}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{deployment.commitHash}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={clsx("p-3 rounded-sm bg-zinc-900 border border-zinc-800")}>
                            {getStatusIcon(deployment.status)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                {deployment.projectName}
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
                                <Badge
                                    variant={
                                        deployment.status === 1 ? 'success' :
                                            deployment.status === 2 ? 'error' :
                                                deployment.status === 0 ? 'info' :
                                                    'default'
                                    }
                                    size="sm"
                                    className="uppercase rounded-full"
                                >
                                    {getStatusText(deployment.status)}
                                </Badge>
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-2">
                                <div className="flex items-center gap-2">
                                    <GitCommit className="h-3 w-3" />
                                    <span className="font-mono text-zinc-500">{deployment.commitHash}</span>
                                    <span className="text-zinc-300">{deployment.commitMessage}</span>
                                </div>
                                <span>•</span>
                                <span>{formatTimeAgo(deployment.deployedAt)}</span>
                                <span>•</span>
                                <span>{deployment.duration}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<Github className="h-4 w-4" />}
                        >
                            View Commit
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<RotateCcw className="h-4 w-4" />}
                        >
                            Rollback
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeploymentHeader;
