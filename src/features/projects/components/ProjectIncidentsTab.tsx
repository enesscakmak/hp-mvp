import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Incident, getSeverityString, getStatusString } from '../../../services/incidentService';
import { formatTimeAgo } from '../../../utils/dateUtils';

interface ProjectIncidentsTabProps {
    incidents: Incident[];
}

const ProjectIncidentsTab: React.FC<ProjectIncidentsTabProps> = ({ incidents }) => {
    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 0: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 1: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 2: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 3: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 1: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 2: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 3: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    return (
        <div className="space-y-4">
            {incidents.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                    <AlertTriangle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No Incidents</h3>
                    <p className="text-zinc-500 mt-2">Incidents for this project will appear here.</p>
                </div>
            ) : (
                incidents.map((incident) => (
                    <Link
                        key={incident.id}
                        to={`/incidents/${incident.id}`}
                        className="block bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-sm p-4 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium text-white">{incident.title}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-sm border font-mono capitalize ${getSeverityColor(incident.severity)}`}>
                                        {getSeverityString(incident.severity)}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-sm border font-mono capitalize ${getStatusColor(incident.status)}`}>
                                        {getStatusString(incident.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-400">{incident.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-zinc-500 font-mono">{formatTimeAgo(incident.createdAt)}</p>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default ProjectIncidentsTab;
