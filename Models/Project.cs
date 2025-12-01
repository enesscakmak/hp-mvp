using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "healthy"; // healthy, warning, down

        public string LastDeploy { get; set; } = "Unknown";

        public string Framework { get; set; } = "react"; // react, node, python, go

        public string Uptime { get; set; } = "0%";

        public string ErrorRate { get; set; } = "0%";

        public string AvgLatency { get; set; } = "0ms";

        public string ActiveUsers { get; set; } = "0";

        public string? RepoUrl { get; set; } = "Never";
    }
}
