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
                new Project
                {
                    Name = "Hyperion-Core",
                    Description = "Main backend service for the Hyperion platform. Handles authentication, data processing, and API requests.",
                    Status = "healthy",
                    LastDeploy = DateTime.UtcNow.AddHours(-2),
                    Framework = "node",
                    Uptime = 99.99,
                    ErrorRate = "0.01%",
                    AvgLatency = "45ms",
                    ActiveUsers = "1.2k",
                    RepoUrl = "github.com/acme/hyperion-core",
                    K8sCluster = "production-us-east-1",
                    K8sNamespace = "hyperion",
                    ServiceName = "hyperion-core",
                    IngressUrl = "api.hyperion.io",
                    WikiContent = "# Hyperion Core\n\nThis is the main backend service...",
                    ApiKey = "hp_live_987654321",
                    WebhookSecret = "whsec_abcdef123456"
                },
                new Project
                {
                    Name = "Nebula-UI",
                    Description = "Frontend dashboard for customer analytics. Built with React and Tailwind.",
                    Status = "warning",
                    LastDeploy = DateTime.UtcNow.AddDays(-1),
                    Framework = "react",
                    Uptime = 98.5,
                    ErrorRate = "2.1%",
                    AvgLatency = "120ms",
                    ActiveUsers = "850",
                    RepoUrl = "github.com/acme/nebula-ui",
                    K8sCluster = "production-us-east-1",
                    K8sNamespace = "nebula",
                    ServiceName = "nebula-ui",
                    IngressUrl = "dashboard.nebula.io",
                    WikiContent = "# Nebula UI\n\nFrontend dashboard...",
                    ApiKey = "hp_live_123456789",
                    WebhookSecret = "whsec_xyz789012"
                },
                new Project
                {
                    Name = "Chronos-Worker",
                    Description = "Background job processor for scheduled tasks and email notifications.",
                    Status = "healthy",
                    LastDeploy = DateTime.UtcNow.AddHours(-12),
                    Framework = "go",
                    Uptime = 99.95,
                    ErrorRate = "0.05%",
                    AvgLatency = "N/A",
                    ActiveUsers = "N/A",
                    RepoUrl = "github.com/acme/chronos-worker",
                    K8sCluster = "production-us-west-2",
                    K8sNamespace = "chronos",
                    ServiceName = "chronos-worker",
                    IngressUrl = "",
                    WikiContent = "# Chronos Worker\n\nBackground job processor...",
                    ApiKey = "hp_live_456123789",
                    WebhookSecret = "whsec_pqr345678"
                },
                new Project
                {
                    Name = "Atlas-DB",
                    Description = "Primary database cluster configuration and monitoring.",
                    Status = "down",
                    LastDeploy = DateTime.UtcNow.AddDays(-5),
                    Framework = "python",
                    Uptime = 85.0,
                    ErrorRate = "15%",
                    AvgLatency = "500ms",
                    ActiveUsers = "N/A",
                    RepoUrl = "github.com/acme/atlas-db",
                    K8sCluster = "production-eu-central-1",
                    K8sNamespace = "atlas",
                    ServiceName = "atlas-db-primary",
                    IngressUrl = "db.atlas.io",
                    WikiContent = "# Atlas DB\n\nDatabase cluster...",
                    ApiKey = "hp_live_789456123",
                    WebhookSecret = "whsec_lmn901234"
                }
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
                    CommitMessage = "feat: implement OIDC provider",
                    Author = "enes",
                    Branch = "main",
                    Duration = "45s",
                    LogsJson = "[{\"time\":\"00:00\",\"level\":\"info\",\"message\":\"Starting deployment...\"},{\"time\":\"00:01\",\"level\":\"info\",\"message\":\"Pulling latest code from main branch\"},{\"time\":\"00:15\",\"level\":\"info\",\"message\":\"Running build process...\"},{\"time\":\"00:30\",\"level\":\"info\",\"message\":\"Build completed successfully\"},{\"time\":\"00:32\",\"level\":\"info\",\"message\":\"Running tests...\"},{\"time\":\"00:38\",\"level\":\"success\",\"message\":\"All tests passed (24/24)\"},{\"time\":\"00:40\",\"level\":\"info\",\"message\":\"Deploying to production...\"},{\"time\":\"00:43\",\"level\":\"info\",\"message\":\"Health check passed\"},{\"time\":\"00:45\",\"level\":\"success\",\"message\":\"Deployment completed successfully\"}]",
                    TimelineJson = "[{\"step\":\"Queued\",\"status\":\"completed\",\"duration\":\"1s\"},{\"step\":\"Building\",\"status\":\"completed\",\"duration\":\"30s\"},{\"step\":\"Testing\",\"status\":\"completed\",\"duration\":\"8s\"},{\"step\":\"Deploying\",\"status\":\"completed\",\"duration\":\"5s\"},{\"step\":\"Health Check\",\"status\":\"completed\",\"duration\":\"1s\"}]"
                },
                new Deployment {
                    ProjectName = "payment-gateway",
                    Version = "v2.0.1",
                    Environment = "Staging",
                    Status = DeploymentStatus.Success,
                    DeployedAt = DateTime.UtcNow.AddMinutes(-30),
                    Notes = "Testing new stripe integration",
                    CommitHash = "e5f6g7h",
                    CommitMessage = "chore: update stripe api version",
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
                    CommitMessage = "fix: modal positioning issue",
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
                    CommitMessage = "perf: optimize etl batch processing",
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
                new Incident { 
                    Title = "High Error Rate in Auth Service", 
                    Description = "Spike in authentication failures after deployment", 
                    Type = IncidentType.Bug, 
                    Severity = IncidentSeverity.Critical, 
                    Status = IncidentStatus.Resolved, 
                    CreatedAt = DateTime.UtcNow.AddHours(-2),
                    ResolvedAt = DateTime.UtcNow.AddHours(-1),
                    AssignedTo = "enes",
                    DeploymentId = 1,
                    ProjectId = 1
                },
                new Incident { 
                    Title = "Payment Gateway Timeout", 
                    Description = "Users experiencing timeouts during checkout", 
                    Type = IncidentType.Outage, 
                    Severity = IncidentSeverity.High, 
                    Status = IncidentStatus.InProgress, 
                    CreatedAt = DateTime.UtcNow.AddHours(-4),
                    AssignedTo = "alex",
                    DeploymentId = 2,
                    ProjectId = 2
                },
                new Incident { 
                    Title = "Slow Dashboard Load Times", 
                    Description = "Dashboard taking 5+ seconds to load", 
                    Type = IncidentType.Bug, 
                    Severity = IncidentSeverity.Medium, 
                    Status = IncidentStatus.Open, 
                    CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                    AssignedTo = "antigravity",
                    DeploymentId = 3,
                    ProjectId = 3
                },
                new Incident { 
                    Title = "Database Connection Pool Exhausted", 
                    Description = "Connection pool hitting max capacity", 
                    Type = IncidentType.Outage, 
                    Severity = IncidentSeverity.High, 
                    Status = IncidentStatus.Resolved, 
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    ResolvedAt = DateTime.UtcNow.AddHours(-4),
                    AssignedTo = "sarah",
                    DeploymentId = 4,
                    ProjectId = 4
                }
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

            // Seed environment variables
            var envVars = new EnvironmentVariable[]
            {
                new EnvironmentVariable { ProjectId = 1, Key = "NODE_ENV", Value = "production" },
                new EnvironmentVariable { ProjectId = 1, Key = "DB_HOST", Value = "db.internal" },
                new EnvironmentVariable { ProjectId = 1, Key = "API_KEY", Value = "sk_live_123456" },
                new EnvironmentVariable { ProjectId = 2, Key = "STRIPE_KEY", Value = "pk_test_987654" },
                new EnvironmentVariable { ProjectId = 3, Key = "REACT_APP_API_URL", Value = "https://api.company.com" }
            };

            context.EnvironmentVariables.AddRange(envVars);
            context.SaveChanges();



            // Seed Clusters
            var clusters = new Cluster[]
            {
                new Cluster { Name = "Production US-East", Region = "us-east-1", Description = "Primary production cluster" },
                new Cluster { Name = "Staging EU-West", Region = "eu-west-1", Description = "Staging environment" },
                new Cluster { Name = "Dev Cluster", Region = "us-west-2", Description = "Development and testing" }
            };
            context.Clusters.AddRange(clusters);
            context.SaveChanges();

            // Seed Project Resources
            var resources = new ProjectResource[]
            {
                // Shared / Global Resources (assigned to Project 1 for demo, or we could make them global if ProjectId was nullable)
                // For this MVP, we'll put the Cluster resource in Project 1 so it's visible.
                new ProjectResource
                {
                    ProjectId = 1,
                    Name = "production-us-east-1",
                    Type = "Cluster",
                    Description = "# Production Cluster (US-East-1)\n\nMain EKS cluster for production workloads.\n\n- **Version**: 1.24\n- **Nodes**: 5 x m5.large\n- **VPC**: vpc-0a1b2c3d4e5f6g7h8",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "API Server", Value = "https://A1B2C3D4E5F6.gr7.us-east-1.eks.amazonaws.com" },
                        new ResourceAttribute { Key = "Region", Value = "us-east-1" },
                        new ResourceAttribute { Key = "Version", Value = "1.24" },
                        new ResourceAttribute { Key = "OIDC Issuer", Value = "https://oidc.eks.us-east-1.amazonaws.com/id/A1B2C3D4E5F6" }
                    }
                },

                // Project 1: Hyperion-Core
                new ProjectResource
                {
                    ProjectId = 1,
                    Name = "Kubernetes Config",
                    Type = "Kubernetes",
                    Description = "# Kubernetes Cluster\n\nPrimary production cluster hosted on AWS EKS.\n\n## Access\nUse the `aws-iam-authenticator` to connect.\n\n```bash\naws eks update-kubeconfig --name production-us-east-1\n```",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Cluster", Value = "production-us-east-1" },
                        new ResourceAttribute { Key = "Namespace", Value = "hyperion" },
                        new ResourceAttribute { Key = "Service Name", Value = "hyperion-core" },
                        new ResourceAttribute { Key = "Replicas", Value = "3" }
                    }
                },
                new ProjectResource
                {
                    ProjectId = 1,
                    Name = "Network Config",
                    Type = "Network",
                    Description = "# Network Configuration\n\nIngress managed via ALB Controller.\n\n- **Load Balancer**: Application Load Balancer (ALB)\n- **SSL**: ACM Certificate `*.hyperion.io`",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Ingress URL", Value = "api.hyperion.io" },
                        new ResourceAttribute { Key = "Load Balancer", Value = "AWS-ALB-PROD-1" },
                        new ResourceAttribute { Key = "Port", Value = "8080" }
                    }
                },
                new ProjectResource
                {
                    ProjectId = 1,
                    Name = "Primary Database",
                    Type = "Database",
                    Description = "# Primary Database\n\nPostgreSQL 14.2 instance.\n\n## Connection\nUse the read-replica for analytics queries.",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Host", Value = "db-prod.example.com" },
                        new ResourceAttribute { Key = "Port", Value = "5432" },
                        new ResourceAttribute { Key = "Version", Value = "14.2" },
                        new ResourceAttribute { Key = "Type", Value = "PostgreSQL" }
                    }
                },
                new ProjectResource
                {
                    ProjectId = 1,
                    Name = "Redis Cache",
                    Type = "Redis",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Host", Value = "redis-prod.example.com" },
                        new ResourceAttribute { Key = "Port", Value = "6379" }
                    }
                },

                // Project 2: Nebula-UI
                new ProjectResource
                {
                    ProjectId = 2,
                    Name = "Kubernetes Config",
                    Type = "Kubernetes",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Cluster", Value = "production-us-east-1" },
                        new ResourceAttribute { Key = "Namespace", Value = "nebula" },
                        new ResourceAttribute { Key = "Service Name", Value = "nebula-ui" }
                    }
                },
                new ProjectResource
                {
                    ProjectId = 2,
                    Name = "Network Config",
                    Type = "Network",
                    Attributes = new List<ResourceAttribute>
                    {
                        new ResourceAttribute { Key = "Ingress URL", Value = "dashboard.nebula.io" },
                        new ResourceAttribute { Key = "CDN", Value = "CloudFront" }
                    }
                }
            };
            context.ProjectResources.AddRange(resources);
            context.SaveChanges();
        }
    }
}
