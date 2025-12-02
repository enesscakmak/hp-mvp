using System.ComponentModel.DataAnnotations;

namespace IncidentDashboard.Models
{
    public class Cluster
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
