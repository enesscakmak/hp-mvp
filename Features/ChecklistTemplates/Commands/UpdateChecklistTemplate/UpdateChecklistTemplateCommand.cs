using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistTemplates.Commands.UpdateChecklistTemplate
{
    public class UpdateChecklistTemplateCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string StepsJson { get; set; }
    }

    public class UpdateChecklistTemplateCommandHandler : IRequestHandler<UpdateChecklistTemplateCommand, bool>
    {
        private readonly AppDbContext _context;

        public UpdateChecklistTemplateCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateChecklistTemplateCommand request, CancellationToken cancellationToken)
        {
            var template = await _context.ChecklistTemplates.FindAsync(new object[] { request.Id }, cancellationToken);

            if (template == null)
            {
                return false;
            }

            template.Title = request.Title;
            template.Description = request.Description;
            template.Type = request.Type;
            template.StepsJson = request.StepsJson;
            template.UpdatedAt = DateTime.UtcNow;

            _context.Entry(template).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ChecklistTemplates.Any(e => e.Id == request.Id))
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
