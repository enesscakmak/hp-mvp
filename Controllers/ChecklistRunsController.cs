using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRuns;
using IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRunById;
using IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRunsByTarget;
using IncidentDashboard.Features.ChecklistRuns.Commands.CreateChecklistRun;
using IncidentDashboard.Features.ChecklistRuns.Commands.UpdateChecklistRun;
using IncidentDashboard.Features.ChecklistRuns.Commands.CompleteChecklistRun;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("05. Checklists")]
    public class ChecklistRunsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ChecklistRunsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/ChecklistRuns
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChecklistRun>>> GetChecklistRuns()
        {
            var runs = await _mediator.Send(new GetChecklistRunsQuery());
            return Ok(runs);
        }

        // GET: api/ChecklistRuns/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistRun>> GetChecklistRun(int id)
        {
            var checklistRun = await _mediator.Send(new GetChecklistRunByIdQuery { Id = id });

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
            var runs = await _mediator.Send(new GetChecklistRunsByTargetQuery { TargetId = targetId });
            return Ok(runs);
        }

        // POST: api/ChecklistRuns
        [HttpPost]
        public async Task<ActionResult<ChecklistRun>> PostChecklistRun(CreateChecklistRunCommand command)
        {
            var checklistRun = await _mediator.Send(command);
            return CreatedAtAction("GetChecklistRun", new { id = checklistRun.Id }, checklistRun);
        }

        // PUT: api/ChecklistRuns/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChecklistRun(int id, UpdateChecklistRunCommand command)
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
        
        // PUT: api/ChecklistRuns/5/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteChecklistRun(int id)
        {
            var result = await _mediator.Send(new CompleteChecklistRunCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
