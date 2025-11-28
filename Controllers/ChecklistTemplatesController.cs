using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChecklistTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChecklistTemplatesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ChecklistTemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChecklistTemplate>>> GetChecklistTemplates()
        {
            return await _context.ChecklistTemplates.ToListAsync();
        }

        // GET: api/ChecklistTemplates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistTemplate>> GetChecklistTemplate(int id)
        {
            var checklistTemplate = await _context.ChecklistTemplates.FindAsync(id);

            if (checklistTemplate == null)
            {
                return NotFound();
            }

            return checklistTemplate;
        }

        // POST: api/ChecklistTemplates
        [HttpPost]
        public async Task<ActionResult<ChecklistTemplate>> PostChecklistTemplate(ChecklistTemplate checklistTemplate)
        {
            checklistTemplate.CreatedAt = DateTime.UtcNow;
            checklistTemplate.UpdatedAt = DateTime.UtcNow;
            
            _context.ChecklistTemplates.Add(checklistTemplate);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChecklistTemplate", new { id = checklistTemplate.Id }, checklistTemplate);
        }

        // PUT: api/ChecklistTemplates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChecklistTemplate(int id, ChecklistTemplate checklistTemplate)
        {
            if (id != checklistTemplate.Id)
            {
                return BadRequest();
            }

            checklistTemplate.UpdatedAt = DateTime.UtcNow;
            _context.Entry(checklistTemplate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChecklistTemplateExists(id))
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

        // DELETE: api/ChecklistTemplates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChecklistTemplate(int id)
        {
            var checklistTemplate = await _context.ChecklistTemplates.FindAsync(id);
            if (checklistTemplate == null)
            {
                return NotFound();
            }

            _context.ChecklistTemplates.Remove(checklistTemplate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChecklistTemplateExists(int id)
        {
            return _context.ChecklistTemplates.Any(e => e.Id == id);
        }
    }
}
