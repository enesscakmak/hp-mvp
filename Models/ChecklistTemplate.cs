using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public class ChecklistTemplate
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "deployment"; // "deployment" or "incident"

        [Required]
        public string StepsJson { get; set; } = "[]"; // JSON array of steps

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
