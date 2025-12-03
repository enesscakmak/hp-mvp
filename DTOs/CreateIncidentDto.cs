using System.ComponentModel.DataAnnotations;
using IncidentDashboard.Models;

namespace IncidentDashboard.DTOs
{
    public class CreateIncidentDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public IncidentType Type { get; set; }

        public IncidentSeverity Severity { get; set; }

        public string? AssignedTo { get; set; }

        public int? DeploymentId { get; set; }

        public int? ProjectId { get; set; }
    }
}
