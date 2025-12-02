using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("01. Dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var totalProjects = await _context.Projects.CountAsync();
            var activeIncidents = await _context.Incidents.CountAsync(i => i.Status != Models.IncidentStatus.Closed && i.Status != Models.IncidentStatus.Resolved);
            var recentDeployments = await _context.Deployments.OrderByDescending(d => d.DeployedAt).Take(5).ToListAsync();

            return new
            {
                TotalProjects = totalProjects,
                ActiveIncidents = activeIncidents,
                RecentDeployments = recentDeployments
            };
        }
    }
}
