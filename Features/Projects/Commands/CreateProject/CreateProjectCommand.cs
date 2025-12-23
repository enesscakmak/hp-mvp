using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Projects.Commands.CreateProject
{
    public class CreateProjectCommand : IRequest<Project>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }

    public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, Project>
    {
        private readonly AppDbContext _context;

        public CreateProjectCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Project> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
        {
            var project = new Project
            {
                Name = request.Name,
                Description = request.Description,
                Status = request.Status,
                LastDeploy = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync(cancellationToken);

            return project;
        }
    }
}
