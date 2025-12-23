using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ChecklistTemplates.Queries.GetChecklistTemplateById
{
    public class GetChecklistTemplateByIdQuery : IRequest<ChecklistTemplate>
    {
        public int Id { get; set; }
    }

    public class GetChecklistTemplateByIdQueryHandler : IRequestHandler<GetChecklistTemplateByIdQuery, ChecklistTemplate>
    {
        private readonly AppDbContext _context;

        public GetChecklistTemplateByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistTemplate> Handle(GetChecklistTemplateByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.ChecklistTemplates.FindAsync(new object[] { request.Id }, cancellationToken);
        }
    }
}
