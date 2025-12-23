using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ProjectResources.Commands.CreateProjectResource
{
    public class CreateProjectResourceCommand : IRequest<ProjectResource>
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public int ProjectId { get; set; }
    }

    public class CreateProjectResourceCommandHandler : IRequestHandler<CreateProjectResourceCommand, ProjectResource>
    {
        private readonly AppDbContext _context;

        public CreateProjectResourceCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProjectResource> Handle(CreateProjectResourceCommand request, CancellationToken cancellationToken)
        {
            var resource = new ProjectResource
            {
                Name = request.Name,
                Type = request.Type,
                Description = request.Description,
                ProjectId = request.ProjectId
            };

            _context.ProjectResources.Add(resource);
            await _context.SaveChangesAsync(cancellationToken);

            return resource;
        }
    }
}
