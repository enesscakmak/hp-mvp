using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.ProjectResources.Commands.DeleteProjectResource
{
    public class DeleteProjectResourceCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteProjectResourceCommandHandler : IRequestHandler<DeleteProjectResourceCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteProjectResourceCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteProjectResourceCommand request, CancellationToken cancellationToken)
        {
            var resource = await _context.ProjectResources.FindAsync(new object[] { request.Id }, cancellationToken);
            if (resource == null)
            {
                return false;
            }

            _context.ProjectResources.Remove(resource);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
