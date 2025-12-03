import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Clock,
    User,
    XCircle
} from 'lucide-react';
import { Incident } from '../../../services/incidentService';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

interface IncidentHeaderProps {
    incident: Incident;
    onResolve: () => void;
    onClose: () => void;
    onReassign: () => void;
}

const IncidentHeader: React.FC<IncidentHeaderProps> = ({ incident, onResolve, onClose, onReassign }) => {

    // Helper functions to convert numeric enums to strings
    const getSeverityString = (severity: number): 'low' | 'medium' | 'high' | 'critical' => {
        const map = ['low', 'medium', 'high', 'critical'] as const;
        return map[severity] || 'low';
    };

    const getStatusString = (status: number): 'open' | 'investigating' | 'resolved' | 'closed' => {
        const map = ['open', 'investigating', 'resolved', 'closed'] as const;
        return map[status] || 'open';
    };



    const getStatusIcon = (status: number) => {
        const statusStr = getStatusString(status);
        switch (statusStr) {
            case 'resolved':
            case 'closed':
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'investigating':
                return <Clock className="h-5 w-5 text-blue-500" />;
            case 'open':
                return <AlertTriangle className="h-5 w-5 text-zinc-500" />;
        }
    };

    return (
        <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 mb-4">
                    <Link to="/incidents" className="hover:text-white transition-colors">Incidents</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{incident.id}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-sm bg-zinc-900 border border-zinc-800">
                            {getStatusIcon(incident.status)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3 mb-2">
                                {incident.title}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                    variant={
                                        getSeverityString(incident.severity) === 'critical' ? 'error' :
                                            getSeverityString(incident.severity) === 'high' ? 'warning' :
                                                getSeverityString(incident.severity) === 'medium' ? 'warning' :
                                                    'neutral'
                                    }
                                    size="sm"
                                    className="uppercase"
                                >
                                    {getSeverityString(incident.severity)}
                                </Badge>
                                <Badge
                                    variant={
                                        getStatusString(incident.status) === 'resolved' || getStatusString(incident.status) === 'closed' ? 'success' :
                                            getStatusString(incident.status) === 'investigating' ? 'info' :
                                                'neutral'
                                    }
                                    size="sm"
                                    className="uppercase"
                                >
                                    {getStatusString(incident.status)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {incident.status !== 2 && incident.status !== 3 && (
                            <Button
                                variant="success"
                                size="md"
                                onClick={onResolve}
                                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                            >
                                Resolve
                            </Button>
                        )}
                        {incident.status === 2 && (
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={onClose}
                                leftIcon={<XCircle className="h-4 w-4" />}
                            >
                                Close
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={onReassign}
                            leftIcon={<User className="h-4 w-4" />}
                        >
                            Reassign
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentHeader;
