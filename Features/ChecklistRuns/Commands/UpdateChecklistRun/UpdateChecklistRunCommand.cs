using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistRuns.Commands.UpdateChecklistRun
{
    public class UpdateChecklistRunCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string Title { get; set; }
        public string Status { get; set; }
        public string StepsJson { get; set; }
        public int Progress { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string StartedBy { get; set; }
        public int? TargetId { get; set; }
        public string TargetType { get; set; }
    }

    public class UpdateChecklistRunCommandHandler : IRequestHandler<UpdateChecklistRunCommand, bool>
    {
        private readonly AppDbContext _context;

        public UpdateChecklistRunCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateChecklistRunCommand request, CancellationToken cancellationToken)
        {
            var checklistRun = await _context.ChecklistRuns.FindAsync(new object[] { request.Id }, cancellationToken);

            if (checklistRun == null)
            {
                return false;
            }

            checklistRun.TemplateId = request.TemplateId;
            checklistRun.Title = request.Title;
            checklistRun.Status = request.Status;
            checklistRun.StepsJson = request.StepsJson;
            checklistRun.Progress = request.Progress;
            checklistRun.StartedAt = request.StartedAt;
            checklistRun.CompletedAt = request.CompletedAt;
            checklistRun.StartedBy = request.StartedBy;
            checklistRun.TargetId = request.TargetId;
            checklistRun.TargetType = request.TargetType;

            _context.Entry(checklistRun).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ChecklistRuns.Any(e => e.Id == request.Id))
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
