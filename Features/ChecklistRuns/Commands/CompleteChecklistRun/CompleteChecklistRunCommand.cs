using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.ChecklistRuns.Commands.CompleteChecklistRun
{
    public class CompleteChecklistRunCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class CompleteChecklistRunCommandHandler : IRequestHandler<CompleteChecklistRunCommand, bool>
    {
        private readonly AppDbContext _context;

        public CompleteChecklistRunCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(CompleteChecklistRunCommand request, CancellationToken cancellationToken)
        {
            var run = await _context.ChecklistRuns.FindAsync(new object[] { request.Id }, cancellationToken);
            if (run == null)
            {
                return false;
            }

            run.Status = "completed";
            run.CompletedAt = DateTime.UtcNow;
            run.Progress = 100;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
