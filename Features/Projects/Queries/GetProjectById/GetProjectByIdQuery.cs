using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Projects.Queries.GetProjectById
{
    public class GetProjectByIdQuery : IRequest<Project>
    {
        public int Id { get; set; }
    }

    public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, Project>
    {
        private readonly AppDbContext _context;

        public GetProjectByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Project> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
        {
            var project = await _context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);

            if (project != null)
            {
                // Dynamically calculate LastDeploy
                var latestDeployment = await _context.Deployments
                    .Where(d => d.ProjectName == project.Name)
                    .OrderByDescending(d => d.DeployedAt)
                    .FirstOrDefaultAsync(cancellationToken);
                
                project.LastDeploy = latestDeployment?.DeployedAt ?? DateTime.UtcNow;
            }

            return project;
        }
    }
}
