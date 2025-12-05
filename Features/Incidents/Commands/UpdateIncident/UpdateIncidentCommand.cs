using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Incidents.Commands.UpdateIncident
{
    public class UpdateIncidentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public UpdateIncidentDto IncidentDto { get; set; }

        public UpdateIncidentCommand(int id, UpdateIncidentDto incidentDto)
        {
            Id = id;
            IncidentDto = incidentDto;
        }
    }

    public class UpdateIncidentCommandHandler : IRequestHandler<UpdateIncidentCommand, bool>
    {
        private readonly IIncidentService _incidentService;

        public UpdateIncidentCommandHandler(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        public async Task<bool> Handle(UpdateIncidentCommand request, CancellationToken cancellationToken)
        {
            return await _incidentService.UpdateIncidentAsync(request.Id, request.IncidentDto);
        }
    }
}
