using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Models;

namespace IncidentDashboard.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Incident> Incidents { get; set; }
        public DbSet<Deployment> Deployments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ChecklistTemplate> ChecklistTemplates { get; set; }
        public DbSet<ChecklistRun> ChecklistRuns { get; set; }
    }
}
