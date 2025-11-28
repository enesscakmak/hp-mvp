using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;
using System.Text.Json;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChecklistRunsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChecklistRunsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ChecklistRuns
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChecklistRun>>> GetChecklistRuns()
        {
            return await _context.ChecklistRuns.ToListAsync();
        }

        // GET: api/ChecklistRuns/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistRun>> GetChecklistRun(int id)
        {
            var checklistRun = await _context.ChecklistRuns.FindAsync(id);

            if (checklistRun == null)
            {
                return NotFound();
            }

            return checklistRun;
        }

        // GET: api/ChecklistRuns/by-target/5
        [HttpGet("by-target/{targetId}")]
        public async Task<ActionResult<IEnumerable<ChecklistRun>>> GetChecklistRunsByTarget(int targetId)
        {
            return await _context.ChecklistRuns
                .Where(r => r.TargetId == targetId)
                .ToListAsync();
        }

        // POST: api/ChecklistRuns
        [HttpPost]
        public async Task<ActionResult<ChecklistRun>> PostChecklistRun(ChecklistRun checklistRun)
        {
            checklistRun.StartedAt = DateTime.UtcNow;
            checklistRun.Status = "active";
            checklistRun.Progress = 0;
            
            _context.ChecklistRuns.Add(checklistRun);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChecklistRun", new { id = checklistRun.Id }, checklistRun);
        }

        // PUT: api/ChecklistRuns/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChecklistRun(int id, ChecklistRun checklistRun)
        {
            if (id != checklistRun.Id)
            {
                return BadRequest();
            }

            _context.Entry(checklistRun).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChecklistRunExists(id))
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
        
        // PUT: api/ChecklistRuns/5/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteChecklistRun(int id)
        {
            var run = await _context.ChecklistRuns.FindAsync(id);
            if (run == null)
            {
                return NotFound();
            }

            run.Status = "completed";
            run.CompletedAt = DateTime.UtcNow;
            run.Progress = 100;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChecklistRunExists(int id)
        {
            return _context.ChecklistRuns.Any(e => e.Id == id);
        }
    }
}
