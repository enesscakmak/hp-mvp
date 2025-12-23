using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.EnvironmentVariables.Queries.GetEnvironmentVariablesByProject
{
    public class GetEnvironmentVariablesByProjectQuery : IRequest<IEnumerable<EnvironmentVariable>>
    {
        public int ProjectId { get; set; }
    }

    public class GetEnvironmentVariablesByProjectQueryHandler : IRequestHandler<GetEnvironmentVariablesByProjectQuery, IEnumerable<EnvironmentVariable>>
    {
        private readonly AppDbContext _context;

        public GetEnvironmentVariablesByProjectQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnvironmentVariable>> Handle(GetEnvironmentVariablesByProjectQuery request, CancellationToken cancellationToken)
        {
            return await _context.EnvironmentVariables
                .Where(e => e.ProjectId == request.ProjectId)
                .ToListAsync(cancellationToken);
        }
    }
}
