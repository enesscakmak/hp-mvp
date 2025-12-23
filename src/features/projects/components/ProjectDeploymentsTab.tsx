import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Deployment } from '../../../services/deploymentService';
import { formatTimeAgo } from '../../../utils/dateUtils';

interface ProjectDeploymentsTabProps {
    deployments: Deployment[];
}

const ProjectDeploymentsTab: React.FC<ProjectDeploymentsTabProps> = ({ deployments }) => {
    return (
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
    );
};

export default ProjectDeploymentsTab;
