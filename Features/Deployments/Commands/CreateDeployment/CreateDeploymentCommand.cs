using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Deployments.Commands.CreateDeployment
{
    public class CreateDeploymentCommand : IRequest<DeploymentDto>
    {
        public CreateDeploymentDto DeploymentDto { get; set; }

        public CreateDeploymentCommand(CreateDeploymentDto deploymentDto)
        {
            DeploymentDto = deploymentDto;
        }
    }

    public class CreateDeploymentCommandHandler : IRequestHandler<CreateDeploymentCommand, DeploymentDto>
    {
        private readonly IDeploymentService _deploymentService;

        public CreateDeploymentCommandHandler(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        public async Task<DeploymentDto> Handle(CreateDeploymentCommand request, CancellationToken cancellationToken)
        {
            return await _deploymentService.CreateDeploymentAsync(request.DeploymentDto);
        }
    }
}
