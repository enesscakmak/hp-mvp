using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistTemplates.Queries.GetAllChecklistTemplates
{
    public class GetAllChecklistTemplatesQuery : IRequest<IEnumerable<ChecklistTemplate>>
    {
    }

    public class GetAllChecklistTemplatesQueryHandler : IRequestHandler<GetAllChecklistTemplatesQuery, IEnumerable<ChecklistTemplate>>
    {
        private readonly AppDbContext _context;

        public GetAllChecklistTemplatesQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChecklistTemplate>> Handle(GetAllChecklistTemplatesQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChecklistTemplates.ToListAsync(cancellationToken);
        }
    }
}
