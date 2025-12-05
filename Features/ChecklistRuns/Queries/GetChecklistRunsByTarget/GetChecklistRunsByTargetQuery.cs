using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistRuns.Queries.GetChecklistRunsByTarget
{
    public class GetChecklistRunsByTargetQuery : IRequest<IEnumerable<ChecklistRun>>
    {
        public int TargetId { get; set; }
    }

    public class GetChecklistRunsByTargetQueryHandler : IRequestHandler<GetChecklistRunsByTargetQuery, IEnumerable<ChecklistRun>>
    {
        private readonly AppDbContext _context;

        public GetChecklistRunsByTargetQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChecklistRun>> Handle(GetChecklistRunsByTargetQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChecklistRuns
                .Where(r => r.TargetId == request.TargetId)
                .ToListAsync(cancellationToken);
        }
    }
}
