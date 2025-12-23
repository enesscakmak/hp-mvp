using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IncidentDashboard.Models
{
    public class InfrastructureConfig
    {
        public int Id { get; set; }

        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = "General";

        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }
    }
}
