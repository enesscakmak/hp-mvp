using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.Projects.Queries.GetProjects;
using IncidentDashboard.Features.Projects.Queries.GetProjectById;
using IncidentDashboard.Features.Projects.Commands.CreateProject;
using IncidentDashboard.Features.Projects.Commands.UpdateProject;
using IncidentDashboard.Features.Projects.Commands.DeleteProject;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("02. Projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProjectsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _mediator.Send(new GetProjectsQuery());
            return Ok(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _mediator.Send(new GetProjectByIdQuery { Id = id });

            if (project == null)
            {
                return NotFound();
            }

            return project;
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(CreateProjectCommand command)
        {
            var project = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Project>> PutProject(int id, UpdateProjectCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            var project = await _mediator.Send(command);

            if (project == null)
            {
                return NotFound();
            }

            return project;
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var result = await _mediator.Send(new DeleteProjectCommand { Id = id });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
