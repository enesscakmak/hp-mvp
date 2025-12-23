using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistTemplates.Commands.CreateChecklistTemplate
{
    public class CreateChecklistTemplateCommand : IRequest<ChecklistTemplate>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string StepsJson { get; set; }
    }

    public class CreateChecklistTemplateCommandHandler : IRequestHandler<CreateChecklistTemplateCommand, ChecklistTemplate>
    {
        private readonly AppDbContext _context;

        public CreateChecklistTemplateCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistTemplate> Handle(CreateChecklistTemplateCommand request, CancellationToken cancellationToken)
        {
            var template = new ChecklistTemplate
            {
                Title = request.Title,
                Description = request.Description,
                Type = request.Type,
                StepsJson = request.StepsJson,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ChecklistTemplates.Add(template);
            await _context.SaveChangesAsync(cancellationToken);

            return template;
        }
    }
}
