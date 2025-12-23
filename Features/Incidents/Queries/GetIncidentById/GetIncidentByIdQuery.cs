using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Incidents.Queries.GetIncidentById
{
    public class GetIncidentByIdQuery : IRequest<IncidentDto?>
    {
        public int Id { get; set; }
    }

    public class GetIncidentByIdQueryHandler : IRequestHandler<GetIncidentByIdQuery, IncidentDto?>
    {
        private readonly IIncidentService _incidentService;

        public GetIncidentByIdQueryHandler(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        public async Task<IncidentDto?> Handle(GetIncidentByIdQuery request, CancellationToken cancellationToken)
        {
            return await _incidentService.GetIncidentByIdAsync(request.Id);
        }
    }
}
