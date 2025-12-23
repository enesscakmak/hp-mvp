using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public enum DeploymentStatus
    {
        Pending,
        Success,
        Failed
    }

    public class Deployment
    {
        public int Id { get; set; }

        [Required]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        public string Version { get; set; } = string.Empty;

        public string Environment { get; set; } = "Production";

        public DeploymentStatus Status { get; set; }

        public DateTime DeployedAt { get; set; } = DateTime.UtcNow;

        public string Notes { get; set; } = string.Empty;

        public string CommitHash { get; set; } = string.Empty;

        public string CommitMessage { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public string Duration { get; set; } = string.Empty;

        public string Branch { get; set; } = string.Empty;

        public string LogsJson { get; set; } = "[]";

        public string TimelineJson { get; set; } = "[]";
    }
}
