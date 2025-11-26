using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public class ChecklistRun
    {
        public int Id { get; set; }

        public int TemplateId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "active"; // "active" or "completed"

        [Required]
        public string StepsJson { get; set; } = "[]"; // JSON array with completion status

        public int Progress { get; set; } = 0;

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        [Required]
        public string StartedBy { get; set; } = string.Empty;

        public int? TargetId { get; set; }

        public string TargetType { get; set; } = string.Empty; // "deployment" or "incident"
    }
}
