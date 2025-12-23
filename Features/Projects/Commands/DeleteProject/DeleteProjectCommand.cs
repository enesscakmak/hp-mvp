using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.Projects.Commands.DeleteProject
{
    public class DeleteProjectCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteProjectCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
        {
            var project = await _context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);
            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
