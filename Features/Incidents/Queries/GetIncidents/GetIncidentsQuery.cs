using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Incidents.Queries.GetIncidents
{
    public class GetIncidentsQuery : IRequest<PagedResult<IncidentDto>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int? DeploymentId { get; set; }
        public int? ProjectId { get; set; }
    }

    public class GetIncidentsQueryHandler : IRequestHandler<GetIncidentsQuery, PagedResult<IncidentDto>>
    {
        private readonly IIncidentService _incidentService;

        public GetIncidentsQueryHandler(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        public async Task<PagedResult<IncidentDto>> Handle(GetIncidentsQuery request, CancellationToken cancellationToken)
        {
            return await _incidentService.GetIncidentsAsync(request.Page, request.PageSize, request.DeploymentId, request.ProjectId);
        }
    }
}
