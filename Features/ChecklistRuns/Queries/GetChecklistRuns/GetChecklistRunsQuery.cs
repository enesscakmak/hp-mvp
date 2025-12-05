using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRuns
{
    public class GetChecklistRunsQuery : IRequest<IEnumerable<ChecklistRun>>
    {
    }

    public class GetChecklistRunsQueryHandler : IRequestHandler<GetChecklistRunsQuery, IEnumerable<ChecklistRun>>
    {
        private readonly AppDbContext _context;

        public GetChecklistRunsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChecklistRun>> Handle(GetChecklistRunsQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChecklistRuns.ToListAsync(cancellationToken);
        }
    }
}
