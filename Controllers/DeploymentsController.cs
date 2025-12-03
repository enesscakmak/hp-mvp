using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("03. Deployments")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class DeploymentsController : ControllerBase
    {
        private readonly IDeploymentService _deploymentService;

        public DeploymentsController(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        // GET: api/Deployments
        [HttpGet]
        public async Task<ActionResult<PagedResult<DeploymentDto>>> GetDeployments([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? projectName = null, [FromQuery] string? environment = null)
        {
            return await _deploymentService.GetDeploymentsAsync(page, pageSize, projectName, environment);
        }

        // GET: api/Deployments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeploymentDto>> GetDeployment(int id)
        {
            var deployment = await _deploymentService.GetDeploymentByIdAsync(id);

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
            var deployment = await _deploymentService.CreateDeploymentAsync(deploymentDto);
            return CreatedAtAction(nameof(GetDeployment), new { id = deployment.Id }, deployment);
        }

        // PUT: api/Deployments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeployment(int id, UpdateDeploymentDto deploymentDto)
        {
            var result = await _deploymentService.UpdateDeploymentAsync(id, deploymentDto);
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
            var result = await _deploymentService.DeleteDeploymentAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
