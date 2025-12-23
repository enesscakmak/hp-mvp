using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Deployments.Commands.UpdateDeployment
{
    public class UpdateDeploymentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public UpdateDeploymentDto DeploymentDto { get; set; }

        public UpdateDeploymentCommand(int id, UpdateDeploymentDto deploymentDto)
        {
            Id = id;
            DeploymentDto = deploymentDto;
        }
    }

    public class UpdateDeploymentCommandHandler : IRequestHandler<UpdateDeploymentCommand, bool>
    {
        private readonly IDeploymentService _deploymentService;

        public UpdateDeploymentCommandHandler(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        public async Task<bool> Handle(UpdateDeploymentCommand request, CancellationToken cancellationToken)
        {
            return await _deploymentService.UpdateDeploymentAsync(request.Id, request.DeploymentDto);
        }
    }
}
