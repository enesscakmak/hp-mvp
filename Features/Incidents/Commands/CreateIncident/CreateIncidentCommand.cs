using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Incidents.Commands.CreateIncident
{
    public class CreateIncidentCommand : IRequest<IncidentDto>
    {
        public CreateIncidentDto IncidentDto { get; set; }

        public CreateIncidentCommand(CreateIncidentDto incidentDto)
        {
            IncidentDto = incidentDto;
        }
    }

    public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, IncidentDto>
    {
        private readonly IIncidentService _incidentService;

        public CreateIncidentCommandHandler(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        public async Task<IncidentDto> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
        {
            return await _incidentService.CreateIncidentAsync(request.IncidentDto);
        }
    }
}
