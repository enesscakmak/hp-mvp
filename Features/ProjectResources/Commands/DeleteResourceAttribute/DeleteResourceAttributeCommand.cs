using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.ProjectResources.Commands.DeleteResourceAttribute
{
    public class DeleteResourceAttributeCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteResourceAttributeCommandHandler : IRequestHandler<DeleteResourceAttributeCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteResourceAttributeCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteResourceAttributeCommand request, CancellationToken cancellationToken)
        {
            var attribute = await _context.ResourceAttributes.FindAsync(new object[] { request.Id }, cancellationToken);
            if (attribute == null)
            {
                return false;
            }

            _context.ResourceAttributes.Remove(attribute);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
