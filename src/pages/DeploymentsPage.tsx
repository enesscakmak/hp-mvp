import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import TriggerDeploymentModal from '../features/deployments/components/TriggerDeploymentModal';
import Button from '../components/ui/Button';
import DeploymentFilters from '../features/deployments/components/DeploymentFilters';
import DeploymentList from '../features/deployments/components/DeploymentList';
import { getDeployments, Deployment } from '../services/deploymentService';

const DeploymentsPage: React.FC = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'building'>('all');
    const [filterEnv, setFilterEnv] = useState<'all' | 'production' | 'staging' | 'preview'>('all');
    const [filterBranch, setFilterBranch] = useState<string>('all');
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        loadDeployments();
    }, [refreshKey]);

    const loadDeployments = async () => {
        try {
            const data = await getDeployments();
            // Sort by deployedAt descending
            const sortedData = data.items.sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());
            setDeployments(sortedData);
        } catch (error) {
            console.error('Failed to load deployments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusString = (status: number) => {
        switch (status) {
            case 1: return 'success';
            case 2: return 'failed';
            case 0: return 'building'; // Assuming 0 is pending/building
            default: return 'queued';
        }
    };

    const uniqueBranches = Array.from(new Set(deployments.map(d => d.branch))).filter(Boolean);

    const filteredDeployments = deployments.filter(dep => {
        const statusStr = getStatusString(dep.status);
        const matchesSearch = dep.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dep.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dep.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || statusStr === filterStatus;
        const matchesEnv = filterEnv === 'all' || dep.environment.toLowerCase() === filterEnv;
        const matchesBranch = filterBranch === 'all' || dep.branch === filterBranch;
        return matchesSearch && matchesStatus && matchesEnv && matchesBranch;
    });

    return (
        <div className="p-4 md:p-8 bg-zinc-950 min-h-screen text-white">
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
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setIsDeployModalOpen(true)}
                            leftIcon={<Rocket className="h-4 w-4" />}
                        >
                            New Deployment
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <DeploymentFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterEnv={filterEnv}
                    setFilterEnv={setFilterEnv}
                    filterBranch={filterBranch}
                    setFilterBranch={setFilterBranch}
                    uniqueBranches={uniqueBranches}
                />

                {/* Deployments List */}
                <DeploymentList
                    deployments={filteredDeployments}
                    isLoading={isLoading}
                    onRollbackSuccess={() => setRefreshKey(prev => prev + 1)}
                />

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
