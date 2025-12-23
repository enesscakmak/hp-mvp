using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.EnvironmentVariables.Queries.GetEnvironmentVariablesByProject;
using IncidentDashboard.Features.EnvironmentVariables.Commands.CreateEnvironmentVariable;
using IncidentDashboard.Features.EnvironmentVariables.Commands.UpdateEnvironmentVariable;
using IncidentDashboard.Features.EnvironmentVariables.Commands.DeleteEnvironmentVariable;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnvironmentVariablesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public EnvironmentVariablesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/EnvironmentVariables/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<EnvironmentVariable>>> GetByProject(int projectId)
        {
            var envVars = await _mediator.Send(new GetEnvironmentVariablesByProjectQuery { ProjectId = projectId });
            return Ok(envVars);
        }

        // POST: api/EnvironmentVariables
        [HttpPost]
        public async Task<ActionResult<EnvironmentVariable>> Create(CreateEnvironmentVariableCommand command)
        {
            var envVar = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetByProject), new { projectId = envVar.ProjectId }, envVar);
        }

        // PUT: api/EnvironmentVariables/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateEnvironmentVariableCommand command)
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

        // DELETE: api/EnvironmentVariables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteEnvironmentVariableCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
