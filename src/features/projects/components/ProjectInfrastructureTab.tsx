import React from 'react';
import ResourceManager from '../../resources/components/ResourceManager';

interface ProjectInfrastructureTabProps {
    projectId: number;
}

const ProjectInfrastructureTab: React.FC<ProjectInfrastructureTabProps> = ({ projectId }) => {
    return (
        <div className="space-y-6">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-sm p-6">
                <ResourceManager projectId={projectId} />
            </div>
        </div>
    );
};

export default ProjectInfrastructureTab;
