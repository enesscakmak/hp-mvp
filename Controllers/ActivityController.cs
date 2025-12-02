using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Tags("08. Activity")]
    public class ActivityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("feed")]
        public async Task<ActionResult<IEnumerable<object>>> GetActivityFeed()
        {
            var activities = new List<object>();

            // Get recent deployments
            var recentDeployments = await _context.Deployments
                .OrderByDescending(d => d.DeployedAt)
                .Take(10)
                .Select(d => new
                {
                    type = "deployment",
                    id = d.Id,
                    title = $"Deployment to {d.Environment}",
                    description = d.ProjectName,
                    timestamp = d.DeployedAt,
                    status = d.Status,
                    metadata = new
                    {
                        environment = d.Environment,
                        version = d.Version,
                        projectName = d.ProjectName
                    }
                })
                .ToListAsync();

            // Get recent incidents
            var recentIncidents = await _context.Incidents
                .OrderByDescending(i => i.CreatedAt)
                .Take(10)
                .Select(i => new
                {
                    type = "incident",
                    id = i.Id,
                    title = i.Title,
                    description = i.Description,
                    timestamp = i.CreatedAt,
                    status = (int)i.Status,
                    metadata = new
                    {
                        severity = (int)i.Severity,
                        incidentType = (int)i.Type,
                        assignedTo = i.AssignedTo
                    }
                })
                .ToListAsync();

            // Get recent checklist runs
            var recentChecklistRuns = await _context.ChecklistRuns
                .OrderByDescending(c => c.StartedAt)
                .Take(10)
                .Select(c => new
                {
                    type = "checklist",
                    id = c.Id,
                    title = c.Title,
                    description = $"Progress: {c.Progress}%",
                    timestamp = c.StartedAt,
                    status = c.Status,
                    metadata = new
                    {
                        progress = c.Progress,
                        startedBy = c.StartedBy,
                        targetType = c.TargetType
                    }
                })
                .ToListAsync();

            // Combine and sort all activities
            activities.AddRange(recentDeployments);
            activities.AddRange(recentIncidents);
            activities.AddRange(recentChecklistRuns);

            // Sort by timestamp (newest first) and take top 20
            var sortedActivities = activities
                .OrderByDescending(a => 
                {
                    var timestampProp = a.GetType().GetProperty("timestamp");
                    return timestampProp?.GetValue(a) as DateTime? ?? DateTime.MinValue;
                })
                .Take(20)
                .ToList();

            return Ok(sortedActivities);
        }
    }
}
