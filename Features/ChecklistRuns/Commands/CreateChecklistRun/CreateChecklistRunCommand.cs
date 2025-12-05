using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistRuns.Commands.CreateChecklistRun
{
    public class CreateChecklistRunCommand : IRequest<ChecklistRun>
    {
        public int TemplateId { get; set; }
        public string Title { get; set; }
        public string StepsJson { get; set; }
        public string StartedBy { get; set; }
        public int? TargetId { get; set; }
        public string TargetType { get; set; }
    }

    public class CreateChecklistRunCommandHandler : IRequestHandler<CreateChecklistRunCommand, ChecklistRun>
    {
        private readonly AppDbContext _context;

        public CreateChecklistRunCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistRun> Handle(CreateChecklistRunCommand request, CancellationToken cancellationToken)
        {
            var checklistRun = new ChecklistRun
            {
                TemplateId = request.TemplateId,
                Title = request.Title,
                StepsJson = request.StepsJson,
                StartedBy = request.StartedBy,
                TargetId = request.TargetId,
                TargetType = request.TargetType,
                StartedAt = DateTime.UtcNow,
                Status = "active",
                Progress = 0
            };

            _context.ChecklistRuns.Add(checklistRun);
            await _context.SaveChangesAsync(cancellationToken);

            return checklistRun;
        }
    }
}
