using System.ComponentModel.DataAnnotations;
using IncidentDashboard.Models;

namespace IncidentDashboard.DTOs
{
    public class CreateDeploymentDto
    {
        [Required]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        public string Environment { get; set; } = string.Empty;

        [Required]
        public string Version { get; set; } = string.Empty;

        public string CommitHash { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;
    }
}
