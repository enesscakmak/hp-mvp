using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.ChecklistTemplates.Commands.DeleteChecklistTemplate
{
    public class DeleteChecklistTemplateCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteChecklistTemplateCommandHandler : IRequestHandler<DeleteChecklistTemplateCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteChecklistTemplateCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteChecklistTemplateCommand request, CancellationToken cancellationToken)
        {
            var template = await _context.ChecklistTemplates.FindAsync(new object[] { request.Id }, cancellationToken);
            if (template == null)
            {
                return false;
            }

            _context.ChecklistTemplates.Remove(template);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
