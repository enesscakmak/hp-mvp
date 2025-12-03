using IncidentDashboard.Models;

namespace IncidentDashboard.DTOs
{
    public class UpdateIncidentDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public IncidentType? Type { get; set; }
        public IncidentSeverity? Severity { get; set; }
        public IncidentStatus? Status { get; set; }
        public string? AssignedTo { get; set; }
        public int? DeploymentId { get; set; }
        public int? ProjectId { get; set; }
    }
}
