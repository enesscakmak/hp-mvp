using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("05. Resources")]
    public class ProjectResourcesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectResourcesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectResources/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectResource>>> GetProjectResources(int projectId)
        {
            return await _context.ProjectResources
                .Include(r => r.Attributes)
                .Where(r => r.ProjectId == projectId)
                .ToListAsync();
        }

        // POST: api/ProjectResources
        [HttpPost]
        public async Task<ActionResult<ProjectResource>> PostProjectResource(ProjectResource resource)
        {
            _context.ProjectResources.Add(resource);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectResources), new { projectId = resource.ProjectId }, resource);
        }

        // PUT: api/ProjectResources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectResource(int id, ProjectResource resource)
        {
            if (id != resource.Id)
            {
                return BadRequest();
            }

            _context.Entry(resource).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectResources.Any(e => e.Id == id))
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

        // DELETE: api/ProjectResources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectResource(int id)
        {
            var resource = await _context.ProjectResources.FindAsync(id);
            if (resource == null)
            {
                return NotFound();
            }

            _context.ProjectResources.Remove(resource);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/ProjectResources/5/attributes
        [HttpPost("{id}/attributes")]
        public async Task<ActionResult<ResourceAttribute>> PostAttribute(int id, ResourceAttribute attribute)
        {
            if (id != attribute.ResourceId)
            {
                return BadRequest();
            }

            _context.ResourceAttributes.Add(attribute);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectResources), new { projectId = id }, attribute);
        }

        // DELETE: api/ProjectResources/attributes/5
        [HttpDelete("attributes/{id}")]
        public async Task<IActionResult> DeleteAttribute(int id)
        {
            var attribute = await _context.ResourceAttributes.FindAsync(id);
            if (attribute == null)
            {
                return NotFound();
            }

            _context.ResourceAttributes.Remove(attribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
