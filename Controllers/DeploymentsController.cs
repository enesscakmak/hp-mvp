using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("03. Deployments")]
    public class DeploymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeploymentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Deployments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Deployment>>> GetDeployments()
        {
            return await _context.Deployments.ToListAsync();
        }

        // GET: api/Deployments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Deployment>> GetDeployment(int id)
        {
            var deployment = await _context.Deployments.FindAsync(id);

            if (deployment == null)
            {
                return NotFound();
            }

            return deployment;
        }

        // POST: api/Deployments
        [HttpPost]
        public async Task<ActionResult<Deployment>> PostDeployment(Deployment deployment)
        {
            _context.Deployments.Add(deployment);
            
            // Update the project's LastDeploy time
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Name == deployment.ProjectName);
            if (project != null)
            {
                project.LastDeploy = DateTime.UtcNow;
                _context.Entry(project).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeployment), new { id = deployment.Id }, deployment);
        }

        // PUT: api/Deployments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeployment(int id, Deployment deployment)
        {
            if (id != deployment.Id)
            {
                return BadRequest();
            }

            _context.Entry(deployment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeploymentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool DeploymentExists(int id)
        {
            return _context.Deployments.Any(e => e.Id == id);
        }
    }
}
