import React from 'react';
import { Loader2, Rocket } from 'lucide-react';
import { Deployment } from '../../../services/deploymentService';
import DeploymentCard from './DeploymentCard';

interface DeploymentListProps {
    deployments: Deployment[];
    isLoading: boolean;
    onRollbackSuccess: () => void;
}

const DeploymentList: React.FC<DeploymentListProps> = ({ deployments, isLoading, onRollbackSuccess }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (deployments.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                <Rocket className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500 font-mono">NO_DEPLOYMENTS_FOUND</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {deployments.map((dep, index) => (
                <DeploymentCard
                    key={dep.id}
                    deployment={dep}
                    index={index}
                    onRollbackSuccess={onRollbackSuccess}
                />
            ))}
        </div>
    );
};

export default DeploymentList;
