using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ProjectResources.Commands.UpdateProjectResource
{
    public class UpdateProjectResourceCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public int ProjectId { get; set; }
    }

    public class UpdateProjectResourceCommandHandler : IRequestHandler<UpdateProjectResourceCommand, bool>
    {
        private readonly AppDbContext _context;

        public UpdateProjectResourceCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateProjectResourceCommand request, CancellationToken cancellationToken)
        {
            var resource = await _context.ProjectResources.FindAsync(new object[] { request.Id }, cancellationToken);

            if (resource == null)
            {
                return false;
            }

            resource.Name = request.Name;
            resource.Type = request.Type;
            resource.Description = request.Description;
            resource.ProjectId = request.ProjectId;

            _context.Entry(resource).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectResources.Any(e => e.Id == request.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }
    }
}
