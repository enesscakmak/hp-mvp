using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QAChecklistsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QAChecklistsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/QAChecklists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QAChecklist>>> GetQAChecklists()
        {
            return await _context.QAChecklists.ToListAsync();
        }

        // GET: api/QAChecklists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QAChecklist>> GetQAChecklist(int id)
        {
            var qaChecklist = await _context.QAChecklists.FindAsync(id);

            if (qaChecklist == null)
            {
                return NotFound();
            }

            return qaChecklist;
        }

        // GET: api/Deployments/{deploymentId}/checklist
        [HttpGet("/api/Deployments/{deploymentId}/checklist")]
        public async Task<ActionResult<IEnumerable<QAChecklist>>> GetChecklistForDeployment(int deploymentId)
        {
            return await _context.QAChecklists
                .Where(c => c.DeploymentId == deploymentId)
                .ToListAsync();
        }

        // POST: api/QAChecklists
        [HttpPost]
        public async Task<ActionResult<QAChecklist>> PostQAChecklist(QAChecklist qaChecklist)
        {
            _context.QAChecklists.Add(qaChecklist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQAChecklist), new { id = qaChecklist.Id }, qaChecklist);
        }

        // PUT: api/QAChecklists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQAChecklist(int id, QAChecklist qaChecklist)
        {
            if (id != qaChecklist.Id)
            {
                return BadRequest();
            }

            _context.Entry(qaChecklist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QAChecklistExists(id))
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

        private bool QAChecklistExists(int id)
        {
            return _context.QAChecklists.Any(e => e.Id == id);
        }
    }
}
