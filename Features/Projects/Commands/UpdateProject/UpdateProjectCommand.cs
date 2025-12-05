using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Projects.Commands.UpdateProject
{
    public class UpdateProjectCommand : IRequest<Project>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }

    public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, Project>
    {
        private readonly AppDbContext _context;

        public UpdateProjectCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Project> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
        {
            var project = await _context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);

            if (project == null)
            {
                return null;
            }

            project.Name = request.Name;
            project.Description = request.Description;
            project.Status = request.Status;

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(e => e.Id == request.Id))
                {
                    return null;
                }
                else
                {
                    throw;
                }
            }

            return project;
        }
    }
}
