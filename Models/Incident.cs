using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public enum IncidentType
    {
        Bug,
        Outage,
        Maintenance,
        Other
    }

    public enum IncidentSeverity
    {
        Low,
        Medium,
        High,
        Critical
    }

    public enum IncidentStatus
    {
        Open,
        InProgress,
        Resolved,
        Closed
    }

    public class Incident
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public IncidentType Type { get; set; }

        public IncidentSeverity Severity { get; set; }

        public IncidentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        public string? AssignedTo { get; set; }

        public int? DeploymentId { get; set; }

        public int? ProjectId { get; set; }
    }
}
