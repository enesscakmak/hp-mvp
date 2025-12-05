using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRunById
{
    public class GetChecklistRunByIdQuery : IRequest<ChecklistRun>
    {
        public int Id { get; set; }
    }

    public class GetChecklistRunByIdQueryHandler : IRequestHandler<GetChecklistRunByIdQuery, ChecklistRun>
    {
        private readonly AppDbContext _context;

        public GetChecklistRunByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistRun> Handle(GetChecklistRunByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChecklistRuns.FindAsync(new object[] { request.Id }, cancellationToken);
        }
    }
}
