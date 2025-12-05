using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.ChecklistTemplates.Queries.GetAllChecklistTemplates;
using IncidentDashboard.Features.ChecklistTemplates.Queries.GetChecklistTemplateById;
using IncidentDashboard.Features.ChecklistTemplates.Commands.CreateChecklistTemplate;
using IncidentDashboard.Features.ChecklistTemplates.Commands.UpdateChecklistTemplate;
using IncidentDashboard.Features.ChecklistTemplates.Commands.DeleteChecklistTemplate;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChecklistTemplatesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ChecklistTemplatesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/ChecklistTemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChecklistTemplate>>> GetChecklistTemplates()
        {
            var templates = await _mediator.Send(new GetAllChecklistTemplatesQuery());
            return Ok(templates);
        }

        // GET: api/ChecklistTemplates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistTemplate>> GetChecklistTemplate(int id)
        {
            var checklistTemplate = await _mediator.Send(new GetChecklistTemplateByIdQuery { Id = id });

            if (checklistTemplate == null)
            {
                return NotFound();
            }

            return checklistTemplate;
        }

        // POST: api/ChecklistTemplates
        [HttpPost]
        public async Task<ActionResult<ChecklistTemplate>> PostChecklistTemplate(CreateChecklistTemplateCommand command)
        {
            var checklistTemplate = await _mediator.Send(command);
            return CreatedAtAction("GetChecklistTemplate", new { id = checklistTemplate.Id }, checklistTemplate);
        }

        // PUT: api/ChecklistTemplates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChecklistTemplate(int id, UpdateChecklistTemplateCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/ChecklistTemplates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChecklistTemplate(int id)
        {
            var result = await _mediator.Send(new DeleteChecklistTemplateCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
