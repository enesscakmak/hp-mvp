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
                new Project { Name = "auth-service", Description = "Authentication and Authorization Service", Status = "healthy", Framework = "go", RepoUrl = "https://github.com/company/auth-service" },
                new Project { Name = "payment-gateway", Description = "Stripe Integration and Billing", Status = "warning", Framework = "node", RepoUrl = "https://github.com/company/payment-gateway" },
                new Project { Name = "frontend-dashboard", Description = "Internal Admin Dashboard", Status = "healthy", Framework = "react", RepoUrl = "https://github.com/company/frontend-dashboard" },
                new Project { Name = "data-pipeline", Description = "ETL Jobs and Analytics", Status = "down", Framework = "python", RepoUrl = "https://github.com/company/data-pipeline" }
            };

            context.Projects.AddRange(projects);
            context.SaveChanges();

            var deployments = new Deployment[]
            {
                new Deployment {
                    ProjectName = "auth-service",
                    Version = "v1.2.0",
                    Environment = "Production",
                    Status = DeploymentStatus.Success,
                    DeployedAt = DateTime.UtcNow.AddHours(-2),
                    Notes = "Routine update",
                    CommitHash = "a1b2c3d",
                    Author = "enes",
                    Branch = "main",
                    Duration = "45s",
                    LogsJson = "[{\"time\":\"00:00\",\"level\":\"info\",\"message\":\"Starting deployment...\"},{\"time\":\"00:01\",\"level\":\"info\",\"message\":\"Pulling latest code from main branch\"},{\"time\":\"00:15\",\"level\":\"info\",\"message\":\"Running build process...\"},{\"time\":\"00:45\",\"level\":\"success\",\"message\":\"Deployment completed successfully\"}]",
                    TimelineJson = "[{\"step\":\"Queued\",\"status\":\"completed\",\"duration\":\"1s\"},{\"step\":\"Building\",\"status\":\"completed\",\"duration\":\"30s\"},{\"step\":\"Testing\",\"status\":\"completed\",\"duration\":\"8s\"},{\"step\":\"Deploying\",\"status\":\"completed\",\"duration\":\"5s\"}]"
                },
                new Deployment {
                    ProjectName = "payment-gateway",
                    Version = "v2.0.1",
                    Environment = "Staging",
                    Status = DeploymentStatus.Success,
                    DeployedAt = DateTime.UtcNow.AddMinutes(-30),
                    Notes = "Testing new stripe integration",
                    CommitHash = "e5f6g7h",
                    Author = "alex",
                    Branch = "feature/stripe-v2",
                    Duration = "1m 20s",
                    LogsJson = "[{\"time\":\"00:00\",\"level\":\"info\",\"message\":\"Starting deployment...\"},{\"time\":\"00:15\",\"level\":\"info\",\"message\":\"Running build process...\"},{\"time\":\"00:45\",\"level\":\"success\",\"message\":\"Build completed\"}]",
                    TimelineJson = "[{\"step\":\"Queued\",\"status\":\"completed\",\"duration\":\"1s\"},{\"step\":\"Building\",\"status\":\"completed\",\"duration\":\"45s\"},{\"step\":\"Testing\",\"status\":\"completed\",\"duration\":\"20s\"}]"
                },
                new Deployment {
                    ProjectName = "frontend-dashboard",
                    Version = "v1.5.0",
                    Environment = "Production",
                    Status = DeploymentStatus.Pending,
                    DeployedAt = DateTime.UtcNow.AddMinutes(-5),
                    Notes = "Hotfix for UI bug",
                    CommitHash = "i8j9k0l",
                    Author = "antigravity",
                    Branch = "fix/modal-bug",
                    Duration = "Running...",
                    LogsJson = "[{\"time\":\"00:00\",\"level\":\"info\",\"message\":\"Starting deployment...\"},{\"time\":\"00:01\",\"level\":\"info\",\"message\":\"Pulling latest code...\"}]",
                    TimelineJson = "[{\"step\":\"Queued\",\"status\":\"completed\",\"duration\":\"1s\"},{\"step\":\"Building\",\"status\":\"in-progress\",\"duration\":\"-\"}]"
                },
                new Deployment {
                    ProjectName = "data-pipeline",
                    Version = "v0.9.0",
                    Environment = "Development",
                    Status = DeploymentStatus.Failed,
                    DeployedAt = DateTime.UtcNow.AddDays(-1),
                    Notes = "Failed due to timeout",
                    CommitHash = "m1n2o3p",
                    Author = "sarah",
                    Branch = "main",
                    Duration = "5m 12s",
                    LogsJson = "[{\"time\":\"00:00\",\"level\":\"info\",\"message\":\"Starting deployment...\"},{\"time\":\"01:05\",\"level\":\"error\",\"message\":\"Test failed: timeout\"}]",
                    TimelineJson = "[{\"step\":\"Queued\",\"status\":\"completed\",\"duration\":\"1s\"},{\"step\":\"Building\",\"status\":\"completed\",\"duration\":\"42s\"},{\"step\":\"Testing\",\"status\":\"failed\",\"duration\":\"18s\"}]"
                }
            };

            context.Deployments.AddRange(deployments);

            var incidents = new Incident[]
            {
                new Incident { Title = "High Latency in US-East", Description = "API response times exceeding 500ms", Type = IncidentType.Outage, Severity = IncidentSeverity.High, Status = IncidentStatus.Open, CreatedAt = DateTime.UtcNow.AddHours(-1), AssignedTo = "enes", ProjectId = 1 },
                new Incident { Title = "Payment Webhook Failure", Description = "Stripe webhooks returning 400", Type = IncidentType.Bug, Severity = IncidentSeverity.Critical, Status = IncidentStatus.InProgress, CreatedAt = DateTime.UtcNow.AddHours(-3), AssignedTo = "alex", ProjectId = 2, DeploymentId = 2 },
                new Incident { Title = "Database Maintenance", Description = "Scheduled index rebuilding", Type = IncidentType.Maintenance, Severity = IncidentSeverity.Low, Status = IncidentStatus.Resolved, CreatedAt = DateTime.UtcNow.AddDays(-2), ResolvedAt = DateTime.UtcNow.AddDays(-2).AddHours(1), AssignedTo = "system", ProjectId = 4 }
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
