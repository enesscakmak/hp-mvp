using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IncidentDashboard.Models
{
    public class EnvironmentVariable
    {
        public int Id { get; set; }

        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty;

        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }
    }
}
