using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQuery : IRequest<object>
    {
    }

    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, object>
    {
        private readonly AppDbContext _context;

        public GetDashboardStatsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var totalProjects = await _context.Projects.CountAsync(cancellationToken);
            var activeIncidents = await _context.Incidents.CountAsync(i => i.Status != Models.IncidentStatus.Closed && i.Status != Models.IncidentStatus.Resolved, cancellationToken);
            var recentDeployments = await _context.Deployments.OrderByDescending(d => d.DeployedAt).Take(5).ToListAsync(cancellationToken);

            return new
            {
                TotalProjects = totalProjects,
                ActiveIncidents = activeIncidents,
                RecentDeployments = recentDeployments
            };
        }
    }
}
