using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ProjectResources.Queries.GetProjectResources
{
    public class GetProjectResourcesQuery : IRequest<IEnumerable<ProjectResource>>
    {
        public int ProjectId { get; set; }
    }

    public class GetProjectResourcesQueryHandler : IRequestHandler<GetProjectResourcesQuery, IEnumerable<ProjectResource>>
    {
        private readonly AppDbContext _context;

        public GetProjectResourcesQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectResource>> Handle(GetProjectResourcesQuery request, CancellationToken cancellationToken)
        {
            return await _context.ProjectResources
                .Include(r => r.Attributes)
                .Where(r => r.ProjectId == request.ProjectId)
                .ToListAsync(cancellationToken);
        }
    }
}
