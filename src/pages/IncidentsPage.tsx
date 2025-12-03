import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { clsx } from 'clsx';
import { getIncidents, Incident, getSeverityString, getStatusString } from '../services/incidentService';
import { formatDateTime } from '../utils/dateUtils';
import CustomDropdown from '../components/ui/CustomDropdown';
import CreateIncidentModal from '../features/incidents/components/CreateIncidentModal';



const IncidentsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'investigating' | 'resolved' | 'closed'>('all');
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = async () => {
        setIsLoading(true);
        const data = await getIncidents();
        setIncidents(data.items);
        setIsLoading(false);
    };

    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const incidentSeverity = getSeverityString(inc.severity);
        const incidentStatus = getStatusString(inc.status);
        const matchesSeverity = filterSeverity === 'all' || incidentSeverity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || incidentStatus === filterStatus;
        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const getSeverityColor = (severity: number) => {
        const severityStr = getSeverityString(severity);
        switch (severityStr) {
            case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'low': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusColor = (status: number) => {
        const statusStr = getStatusString(status);
        switch (statusStr) {
            case 'resolved':
            case 'closed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'investigating':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'open':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    const getStatusIcon = (status: number) => {
        const statusStr = getStatusString(status);
        switch (statusStr) {
            case 'resolved':
            case 'closed':
                return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'investigating':
                return <Loader2 className="h-4 w-4 text-blue-500" />;
            case 'open':
                return <Clock className="h-4 w-4 text-zinc-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Incidents</h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            INCIDENT_TRACKING_SYSTEM
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
                            <span className="text-emerald-500">●</span> {filteredIncidents.length} Total Incidents
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-sm font-medium hover:bg-zinc-200 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Report Incident</span>
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search incidents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <CustomDropdown
                            value={filterSeverity}
                            onChange={(value) => setFilterSeverity(value as any)}
                            options={[
                                { value: 'all', label: 'All Severity' },
                                { value: 'critical', label: 'Critical' },
                                { value: 'high', label: 'High' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'low', label: 'Low' }
                            ]}
                            className="min-w-[140px]"
                        />

                        <CustomDropdown
                            value={filterStatus}
                            onChange={(value) => setFilterStatus(value as any)}
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'open', label: 'Open' },
                                { value: 'investigating', label: 'Investigating' },
                                { value: 'resolved', label: 'Resolved' },
                                { value: 'closed', label: 'Closed' }
                            ]}
                            className="min-w-[160px]"
                        />
                    </div>
                </div>

                {/* Incidents List */}
                <div className="space-y-4">
                    {filteredIncidents.map((incident, index) => (
                        <Link
                            key={incident.id}
                            to={`/incidents/${incident.id}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-zinc-900/30 border border-zinc-800 rounded-sm p-4 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                                    {/* Left: Status & Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1 p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                            {getStatusIcon(incident.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-white font-medium">{incident.title}</h3>
                                                <span className="text-zinc-600 text-xs">•</span>
                                                <span className={clsx("text-xs px-1.5 py-0.5 rounded-sm uppercase font-mono border",
                                                    getSeverityColor(incident.severity)
                                                )}>
                                                    {getSeverityString(incident.severity)}
                                                </span>
                                                <span className={clsx("text-xs px-1.5 py-0.5 rounded-sm uppercase font-mono border",
                                                    getStatusColor(incident.status)
                                                )}>
                                                    {getStatusString(incident.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-400 mb-2">{incident.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                                                <span>Created {formatDateTime(incident.createdAt)}</span>
                                                {incident.resolvedAt && <span>• Resolved {formatDateTime(incident.resolvedAt)}</span>}
                                                {incident.assignedTo && <span>• Assigned to {incident.assignedTo}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Project Link */}
                                    {incident.projectId && (
                                        <div className="text-sm text-zinc-500 font-mono">
                                            Project: {incident.projectId}
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {filteredIncidents.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-sm">
                            <AlertTriangle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-500 font-mono">NO_INCIDENTS_FOUND</p>
                        </div>
                    )}
                </div>

            </div>

            <CreateIncidentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    loadIncidents(); // Refresh incidents after creation
                }}
            />
        </div>
    );
};

export default IncidentsPage;
