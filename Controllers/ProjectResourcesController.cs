using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.ProjectResources.Queries.GetProjectResources;
using IncidentDashboard.Features.ProjectResources.Commands.CreateProjectResource;
using IncidentDashboard.Features.ProjectResources.Commands.UpdateProjectResource;
using IncidentDashboard.Features.ProjectResources.Commands.DeleteProjectResource;
using IncidentDashboard.Features.ProjectResources.Commands.AddResourceAttribute;
using IncidentDashboard.Features.ProjectResources.Commands.DeleteResourceAttribute;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectResourcesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProjectResourcesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/ProjectResources/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectResource>>> GetProjectResources(int projectId)
        {
            var resources = await _mediator.Send(new GetProjectResourcesQuery { ProjectId = projectId });
            return Ok(resources);
        }

        // POST: api/ProjectResources
        [HttpPost]
        public async Task<ActionResult<ProjectResource>> PostProjectResource(CreateProjectResourceCommand command)
        {
            var resource = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProjectResources), new { projectId = resource.ProjectId }, resource);
        }

        // PUT: api/ProjectResources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectResource(int id, UpdateProjectResourceCommand command)
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

        // DELETE: api/ProjectResources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectResource(int id)
        {
            var result = await _mediator.Send(new DeleteProjectResourceCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/ProjectResources/attribute
        [HttpPost("attribute")]
        public async Task<ActionResult<ResourceAttribute>> PostAttribute(AddResourceAttributeCommand command)
        {
            var attribute = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProjectResources), new { projectId = attribute.ResourceId }, attribute);
        }

        // DELETE: api/ProjectResources/attribute/5
        [HttpDelete("attribute/{id}")]
        public async Task<IActionResult> DeleteAttribute(int id)
        {
            var result = await _mediator.Send(new DeleteResourceAttributeCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
