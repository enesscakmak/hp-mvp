using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.DTOs;
using IncidentDashboard.Features.Deployments.Queries.GetDeployments;
using IncidentDashboard.Features.Deployments.Queries.GetDeploymentById;
using IncidentDashboard.Features.Deployments.Commands.CreateDeployment;
using IncidentDashboard.Features.Deployments.Commands.UpdateDeployment;
using IncidentDashboard.Features.Deployments.Commands.DeleteDeployment;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("03. Deployments")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class DeploymentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeploymentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Deployments
        [HttpGet]
        public async Task<ActionResult<PagedResult<DeploymentDto>>> GetDeployments([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? projectName = null, [FromQuery] string? environment = null)
        {
            var result = await _mediator.Send(new GetDeploymentsQuery 
            { 
                Page = page, 
                PageSize = pageSize, 
                ProjectName = projectName, 
                Environment = environment 
            });
            return result;
        }

        // GET: api/Deployments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeploymentDto>> GetDeployment(int id)
        {
            var deployment = await _mediator.Send(new GetDeploymentByIdQuery { Id = id });

            if (deployment == null)
            {
                return NotFound();
            }

            return deployment;
        }

        // POST: api/Deployments
        [HttpPost]
        public async Task<ActionResult<DeploymentDto>> PostDeployment(CreateDeploymentDto deploymentDto)
        {
            var deployment = await _mediator.Send(new CreateDeploymentCommand(deploymentDto));
            return CreatedAtAction(nameof(GetDeployment), new { id = deployment.Id }, deployment);
        }

        // PUT: api/Deployments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeployment(int id, UpdateDeploymentDto deploymentDto)
        {
            var result = await _mediator.Send(new UpdateDeploymentCommand(id, deploymentDto));
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Deployments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeployment(int id)
        {
            var result = await _mediator.Send(new DeleteDeploymentCommand { Id = id });
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
