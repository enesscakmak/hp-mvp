using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.Features.Clusters.Queries.GetAllClusters;
using IncidentDashboard.Features.Clusters.Queries.GetClusterById;
using IncidentDashboard.Features.Clusters.Commands.CreateCluster;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("04. Clusters")]
    public class ClustersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClustersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/Clusters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cluster>>> GetClusters()
        {
            var clusters = await _mediator.Send(new GetAllClustersQuery());
            return Ok(clusters);
        }

        // GET: api/Clusters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cluster>> GetCluster(int id)
        {
            var cluster = await _mediator.Send(new GetClusterByIdQuery { Id = id });

            if (cluster == null)
            {
                return NotFound();
            }

            return cluster;
        }

        // POST: api/Clusters
        [HttpPost]
        public async Task<ActionResult<Cluster>> PostCluster(CreateClusterCommand command)
        {
            var cluster = await _mediator.Send(command);
            return CreatedAtAction("GetCluster", new { id = cluster.Id }, cluster);
        }
    }
}
