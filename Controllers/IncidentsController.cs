using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.DTOs;
using IncidentDashboard.Features.Incidents.Queries.GetIncidents;
using IncidentDashboard.Features.Incidents.Queries.GetIncidentById;
using IncidentDashboard.Features.Incidents.Commands.CreateIncident;
using IncidentDashboard.Features.Incidents.Commands.UpdateIncident;
using IncidentDashboard.Features.Incidents.Commands.DeleteIncident;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("04. Incidents")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class IncidentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public IncidentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Incidents
        [HttpGet]
        public async Task<ActionResult<PagedResult<IncidentDto>>> GetIncidents([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? deploymentId = null, [FromQuery] int? projectId = null)
        {
            var result = await _mediator.Send(new GetIncidentsQuery 
            { 
                Page = page, 
                PageSize = pageSize, 
                DeploymentId = deploymentId, 
                ProjectId = projectId 
            });
            return result;
        }

        // GET: api/Incidents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IncidentDto>> GetIncident(int id)
        {
            var incident = await _mediator.Send(new GetIncidentByIdQuery { Id = id });

            if (incident == null)
            {
                return NotFound();
            }

            return incident;
        }

        // POST: api/Incidents
        [HttpPost]
        public async Task<ActionResult<IncidentDto>> PostIncident(CreateIncidentDto incidentDto)
        {
            var incident = await _mediator.Send(new CreateIncidentCommand(incidentDto));
            return CreatedAtAction(nameof(GetIncident), new { id = incident.Id }, incident);
        }

        // PUT: api/Incidents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncident(int id, UpdateIncidentDto incidentDto)
        {
            var result = await _mediator.Send(new UpdateIncidentCommand(id, incidentDto));
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Incidents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncident(int id)
        {
            var result = await _mediator.Send(new DeleteIncidentCommand { Id = id });
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
