using MediatR;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Incidents.Commands.DeleteIncident
{
    public class DeleteIncidentCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteIncidentCommandHandler : IRequestHandler<DeleteIncidentCommand, bool>
    {
        private readonly IIncidentService _incidentService;

        public DeleteIncidentCommandHandler(IIncidentService incidentService)
        {
            _incidentService = incidentService;
        }

        public async Task<bool> Handle(DeleteIncidentCommand request, CancellationToken cancellationToken)
        {
            return await _incidentService.DeleteIncidentAsync(request.Id);
        }
    }
}
