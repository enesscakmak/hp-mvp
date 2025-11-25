using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public class QAChecklist
    {
        public int Id { get; set; }

        public int? DeploymentId { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public bool IsPassed { get; set; }

        public DateTime? CheckedAt { get; set; }

        public string CheckedBy { get; set; } = string.Empty;
    }
}
