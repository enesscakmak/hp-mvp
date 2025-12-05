using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Deployments.Queries.GetDeploymentById
{
    public class GetDeploymentByIdQuery : IRequest<DeploymentDto?>
    {
        public int Id { get; set; }
    }

    public class GetDeploymentByIdQueryHandler : IRequestHandler<GetDeploymentByIdQuery, DeploymentDto?>
    {
        private readonly IDeploymentService _deploymentService;

        public GetDeploymentByIdQueryHandler(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        public async Task<DeploymentDto?> Handle(GetDeploymentByIdQuery request, CancellationToken cancellationToken)
        {
            return await _deploymentService.GetDeploymentByIdAsync(request.Id);
        }
    }
}
