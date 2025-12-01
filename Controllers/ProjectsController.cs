using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _context.Projects.ToListAsync();
            
            // Get latest deployment for each project
            var latestDeployments = await _context.Deployments
                .GroupBy(d => d.ProjectName)
                .Select(g => new { ProjectName = g.Key, LastDeploy = g.Max(d => d.DeployedAt) })
                .ToDictionaryAsync(x => x.ProjectName, x => x.LastDeploy);

            foreach (var project in projects)
            {
                if (latestDeployments.TryGetValue(project.Name, out var lastDeploy))
                {
                    project.LastDeploy = lastDeploy.ToString("O");
                }
                else
                {
                    project.LastDeploy = "Unknown";
                }
            }

            return projects;
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            // Get latest deployment for this project
            var latestDeployment = await _context.Deployments
                .Where(d => d.ProjectName == project.Name)
                .OrderByDescending(d => d.DeployedAt)
                .FirstOrDefaultAsync();

            if (latestDeployment != null)
            {
                project.LastDeploy = latestDeployment.DeployedAt.ToString("O");
            }
            else
            {
                project.LastDeploy = "Unknown";
            }

            return project;
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Project>> PutProject(int id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return project;
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
