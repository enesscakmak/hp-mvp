using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Clusters.Queries.GetAllClusters
{
    public class GetAllClustersQuery : IRequest<IEnumerable<Cluster>>
    {
    }

    public class GetAllClustersQueryHandler : IRequestHandler<GetAllClustersQuery, IEnumerable<Cluster>>
    {
        private readonly AppDbContext _context;

        public GetAllClustersQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cluster>> Handle(GetAllClustersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Clusters.ToListAsync(cancellationToken);
        }
    }
}
