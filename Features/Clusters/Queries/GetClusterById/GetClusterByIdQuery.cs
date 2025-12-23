using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Clusters.Queries.GetClusterById
{
    public class GetClusterByIdQuery : IRequest<Cluster>
    {
        public int Id { get; set; }
    }

    public class GetClusterByIdQueryHandler : IRequestHandler<GetClusterByIdQuery, Cluster>
    {
        private readonly AppDbContext _context;

        public GetClusterByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Cluster> Handle(GetClusterByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Clusters.FindAsync(new object[] { request.Id }, cancellationToken);
        }
    }
}
