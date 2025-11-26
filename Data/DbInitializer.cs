using IncidentDashboard.Models;

namespace IncidentDashboard.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // Look for any deployments.
            if (context.Deployments.Any())
            {
                return;   // DB has been seeded
            }

            var projects = new Project[]
            {
                new Project { Name = "auth-service", Description = "Authentication and Authorization Service", Status = "healthy", Framework = "go", LastDeploy = "2h ago" },
                new Project { Name = "payment-gateway", Description = "Stripe Integration and Billing", Status = "warning", Framework = "node", LastDeploy = "30m ago" },
                new Project { Name = "frontend-dashboard", Description = "Internal Admin Dashboard", Status = "healthy", Framework = "react", LastDeploy = "5m ago" },
                new Project { Name = "data-pipeline", Description = "ETL Jobs and Analytics", Status = "down", Framework = "python", LastDeploy = "1d ago" }
            };

            context.Projects.AddRange(projects);
            context.SaveChanges();

            var deployments = new Deployment[]
            {
                new Deployment { ProjectName = "auth-service", Version = "v1.2.0", Environment = "Production", Status = DeploymentStatus.Success, DeployedAt = DateTime.UtcNow.AddHours(-2), Notes = "Routine update" },
                new Deployment { ProjectName = "payment-gateway", Version = "v2.0.1", Environment = "Staging", Status = DeploymentStatus.Success, DeployedAt = DateTime.UtcNow.AddMinutes(-30), Notes = "Testing new stripe integration" },
                new Deployment { ProjectName = "frontend-dashboard", Version = "v1.5.0", Environment = "Production", Status = DeploymentStatus.Pending, DeployedAt = DateTime.UtcNow.AddMinutes(-5), Notes = "Hotfix for UI bug" },
                new Deployment { ProjectName = "data-pipeline", Version = "v0.9.0", Environment = "Development", Status = DeploymentStatus.Failed, DeployedAt = DateTime.UtcNow.AddDays(-1), Notes = "Failed due to timeout" }
            };

            context.Deployments.AddRange(deployments);

            var incidents = new Incident[]
            {
                new Incident { Title = "High Latency in US-East", Description = "API response times exceeding 500ms", Type = IncidentType.Outage, Severity = IncidentSeverity.High, Status = IncidentStatus.Open, CreatedAt = DateTime.UtcNow.AddHours(-1) },
                new Incident { Title = "Payment Webhook Failure", Description = "Stripe webhooks returning 400", Type = IncidentType.Bug, Severity = IncidentSeverity.Critical, Status = IncidentStatus.InProgress, CreatedAt = DateTime.UtcNow.AddHours(-3) },
                new Incident { Title = "Database Maintenance", Description = "Scheduled index rebuilding", Type = IncidentType.Maintenance, Severity = IncidentSeverity.Low, Status = IncidentStatus.Resolved, CreatedAt = DateTime.UtcNow.AddDays(-2), ResolvedAt = DateTime.UtcNow.AddDays(-2).AddHours(1) }
            };

            context.Incidents.AddRange(incidents);
            context.SaveChanges();

            // Seed checklist templates
            var checklistTemplates = new ChecklistTemplate[]
            {
                new ChecklistTemplate
                {
                    Title = "Production Deployment",
                    Description = "Standard checklist for production deployments",
                    Type = "deployment",
                    StepsJson = "[{\"id\":\"s1\",\"text\":\"Verify all tests passed\",\"isOptional\":false},{\"id\":\"s2\",\"text\":\"Check database migrations\",\"isOptional\":false},{\"id\":\"s3\",\"text\":\"Notify team in Slack\",\"isOptional\":true},{\"id\":\"s4\",\"text\":\"Monitor error rates\",\"isOptional\":false}]",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ChecklistTemplate
                {
                    Title = "Sev1 Incident Response",
                    Description = "Critical incident response procedure",
                    Type = "incident",
                    StepsJson = "[{\"id\":\"s1\",\"text\":\"Acknowledge incident\",\"isOptional\":false},{\"id\":\"s2\",\"text\":\"Create war room\",\"isOptional\":false},{\"id\":\"s3\",\"text\":\"Assess impact\",\"isOptional\":false},{\"id\":\"s4\",\"text\":\"Update status page\",\"isOptional\":false}]",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.ChecklistTemplates.AddRange(checklistTemplates);
            context.SaveChanges();
        }
    }
}
