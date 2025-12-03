using IncidentDashboard.Models;

namespace IncidentDashboard.DTOs
{
    public class IncidentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IncidentType Type { get; set; }
        public IncidentSeverity Severity { get; set; }
        public IncidentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? AssignedTo { get; set; }
        public int? DeploymentId { get; set; }
        public int? ProjectId { get; set; }
    }
}
