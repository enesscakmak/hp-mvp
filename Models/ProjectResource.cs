using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IncidentDashboard.Models
{
    public class ProjectResource
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // e.g., "Database", "LoadBalancer", "Cache"

        public string? Description { get; set; } // Markdown content for the resource wiki

        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }

        public List<ResourceAttribute> Attributes { get; set; } = new List<ResourceAttribute>();
    }
}
