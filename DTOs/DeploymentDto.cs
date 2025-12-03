using IncidentDashboard.Models;

namespace IncidentDashboard.DTOs
{
    public class DeploymentDto
    {
        public int Id { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string Environment { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DeploymentStatus Status { get; set; }
        public DateTime DeployedAt { get; set; }
        public string CommitHash { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public TimeSpan Duration { get; set; }
    }
}
