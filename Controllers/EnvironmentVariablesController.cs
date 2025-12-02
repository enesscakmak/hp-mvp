using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnvironmentVariablesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EnvironmentVariablesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/EnvironmentVariables/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<EnvironmentVariable>>> GetByProject(int projectId)
        {
            return await _context.EnvironmentVariables
                .Where(e => e.ProjectId == projectId)
                .ToListAsync();
        }

        // POST: api/EnvironmentVariables
        [HttpPost]
        public async Task<ActionResult<EnvironmentVariable>> Create(EnvironmentVariable envVar)
        {
            _context.EnvironmentVariables.Add(envVar);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByProject), new { projectId = envVar.ProjectId }, envVar);
        }

        // PUT: api/EnvironmentVariables/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EnvironmentVariable envVar)
        {
            if (id != envVar.Id)
            {
                return BadRequest();
            }

            _context.Entry(envVar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnvVarExists(id))
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

        // DELETE: api/EnvironmentVariables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var envVar = await _context.EnvironmentVariables.FindAsync(id);
            if (envVar == null)
            {
                return NotFound();
            }

            _context.EnvironmentVariables.Remove(envVar);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnvVarExists(int id)
        {
            return _context.EnvironmentVariables.Any(e => e.Id == id);
        }
    }
}
