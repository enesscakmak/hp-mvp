import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, ExternalLink, GitCommit } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getIncidentById, Incident, resolveIncident, closeIncident, reassignIncident } from '../services/incidentService';
import ChecklistSection from '../features/checklists/components/ChecklistSection';
import IncidentHeader from '../features/incidents/components/IncidentHeader';
import { toast } from 'sonner';
import { formatTimeAgo } from '../utils/dateUtils';

const IncidentDetailsPage: React.FC = () => {
    const { incidentId } = useParams();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [reassignTo, setReassignTo] = useState('');

    useEffect(() => {
        if (incidentId) {
            loadIncident(incidentId);
        }
    }, [incidentId]);

    const loadIncident = async (id: string) => {
        setIsLoading(true);
        const data = await getIncidentById(id);
        setIncident(data);
        setIsLoading(false);
    };

    const handleResolve = async () => {
        if (!incident) return;
        const updated = await resolveIncident(incident.id);
        setIncident(updated);
        toast.success('Incident resolved');
    };

    const handleClose = async () => {
        if (!incident) return;
        const updated = await closeIncident(incident.id);
        setIncident(updated);
        toast.success('Incident closed');
    };

    const handleReassign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!incident || !reassignTo.trim()) return;
        const updated = await reassignIncident(incident.id, reassignTo);
        setIncident(updated);
        setIsReassignModalOpen(false);
        setReassignTo('');
        toast.success(`Incident reassigned to ${updated.assignedTo}`);
    };

    // Mock timeline data
    const timeline = [
        { time: '2h ago', action: 'Incident created', user: 'System', status: 'open' },
        { time: '1h 45m ago', action: 'Assigned to ' + (incident?.assignedTo || 'unknown'), user: 'System', status: 'open' },
        { time: '1h 30m ago', action: 'Status changed to investigating', user: incident?.assignedTo || 'unknown', status: 'investigating' },
        ...(incident?.status === 2 || incident?.status === 3
            ? [{ time: '1h ago', action: 'Incident resolved', user: incident?.assignedTo || 'unknown', status: 'resolved' }]
            : []
        )
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Clock className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!incident) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-xl font-bold mb-2">Incident Not Found</h2>
                <Link to="/incidents" className="text-zinc-500 hover:text-white transition-colors">
                    Return to Incidents
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <IncidentHeader
                incident={incident}
                onResolve={handleResolve}
                onClose={handleClose}
                onReassign={() => setIsReassignModalOpen(true)}
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Description</h2>
                            <p className="text-zinc-400 leading-relaxed">{incident.description}</p>
                        </Card>

                        {/* Timeline */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Activity Timeline</h2>
                            <div className="space-y-4">
                                {timeline.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-zinc-500" />
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div className="w-0.5 h-12 bg-zinc-800 mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-white font-medium">{item.action}</p>
                                            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                                                <span>{item.user}</span>
                                                <span>•</span>
                                                <span>{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <Card className="p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Created</p>
                                    <p className="text-white font-mono">{formatTimeAgo(incident.createdAt)}</p>
                                </div>
                                {incident.resolvedAt && (
                                    <div>
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Resolved</p>
                                        <p className="text-white font-mono">{formatTimeAgo(incident.resolvedAt)}</p>
                                    </div>
                                )}
                                {incident.assignedTo && (
                                    <div>
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Assigned To</p>
                                        <p className="text-white font-mono">{incident.assignedTo}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Checklists */}
                        <ChecklistSection targetId={incident.id.toString()} targetType="incident" />

                        {/* Related Deployment */}
                        {incident.deploymentId && (
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Related Deployment</h3>
                                <Link
                                    to={`/deployments/${incident.deploymentId}`}
                                    className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-sm hover:bg-zinc-800 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <GitCommit className="h-4 w-4 text-zinc-500" />
                                        <span className="text-white font-mono text-sm">{incident.deploymentId}</span>
                                    </div>
                                    <ExternalLink className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                                </Link>
                            </Card>
                        )}

                        {/* Related Project */}
                        {incident.projectId && (
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Related Project</h3>
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm">
                                    <p className="text-white font-mono text-sm">{incident.projectId}</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Reassign Modal */}
            <Modal
                isOpen={isReassignModalOpen}
                onClose={() => setIsReassignModalOpen(false)}
                title="Reassign Incident"
                icon={<User className="h-5 w-5 text-blue-400" />}
            >
                <form onSubmit={handleReassign} className="space-y-4">
                    <Input
                        label="Assign To"
                        value={reassignTo}
                        onChange={(e) => setReassignTo(e.target.value)}
                        placeholder="Enter username"
                        required
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsReassignModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                        >
                            Reassign
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default IncidentDetailsPage;
