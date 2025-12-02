using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("04. Clusters")]
    public class ClustersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClustersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Clusters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cluster>>> GetClusters()
        {
            return await _context.Clusters.ToListAsync();
        }

        // GET: api/Clusters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cluster>> GetCluster(int id)
        {
            var cluster = await _context.Clusters.FindAsync(id);

            if (cluster == null)
            {
                return NotFound();
            }

            return cluster;
        }

        // POST: api/Clusters
        [HttpPost]
        public async Task<ActionResult<Cluster>> PostCluster(Cluster cluster)
        {
            _context.Clusters.Add(cluster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCluster", new { id = cluster.Id }, cluster);
        }
    }
}
