using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Projects.Queries.GetProjects
{
    public class GetProjectsQuery : IRequest<IEnumerable<Project>>
    {
    }

    public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, IEnumerable<Project>>
    {
        private readonly AppDbContext _context;

        public GetProjectsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Project>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
        {
            var projects = await _context.Projects.ToListAsync(cancellationToken);
            
            // Dynamically calculate LastDeploy for each project
            foreach (var project in projects)
            {
                var latestDeployment = await _context.Deployments
                    .Where(d => d.ProjectName == project.Name)
                    .OrderByDescending(d => d.DeployedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                
                project.LastDeploy = latestDeployment?.DeployedAt ?? DateTime.UtcNow;
            }
            
            return projects;
        }
    }
}
