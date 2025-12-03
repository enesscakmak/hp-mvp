using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("04. Incidents")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class IncidentsController : ControllerBase
    {
        private readonly IIncidentService _incidentService;

        public IncidentsController(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        // GET: api/Incidents
        [HttpGet]
        public async Task<ActionResult<PagedResult<IncidentDto>>> GetIncidents([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? deploymentId = null, [FromQuery] int? projectId = null)
        {
            return await _incidentService.GetIncidentsAsync(page, pageSize, deploymentId, projectId);
        }

        // GET: api/Incidents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IncidentDto>> GetIncident(int id)
        {
            var incident = await _incidentService.GetIncidentByIdAsync(id);

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
            var incident = await _incidentService.CreateIncidentAsync(incidentDto);
            return CreatedAtAction(nameof(GetIncident), new { id = incident.Id }, incident);
        }

        // PUT: api/Incidents/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncident(int id, UpdateIncidentDto incidentDto)
        {
            var result = await _incidentService.UpdateIncidentAsync(id, incidentDto);
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
            var result = await _incidentService.DeleteIncidentAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
