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

        public DateTime LastDeploy { get; set; }

        public string Framework { get; set; } = "react"; // react, node, python, go

        public double Uptime { get; set; }

        public int? ClusterId { get; set; }
        public Cluster? Cluster { get; set; }

        public string ErrorRate { get; set; } = "0%";

        public string AvgLatency { get; set; } = "0ms";

        public string ActiveUsers { get; set; } = "0";

        public string? RepoUrl { get; set; } = "Never";

        // Infrastructure Info
        public string? K8sNamespace { get; set; } = "default";
        public string? K8sCluster { get; set; } = "production-cluster";
        public string? ServiceName { get; set; } = string.Empty;
        public string? IngressUrl { get; set; } = string.Empty;

        // Wiki & Documentation
        public string? WikiContent { get; set; } = "# Project Documentation\n\nWelcome to the project wiki.";

        // Secrets & Config
        public string? ApiKey { get; set; } = string.Empty;
        public string? WebhookSecret { get; set; } = string.Empty;
    }
}
