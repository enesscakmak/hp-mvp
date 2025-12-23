using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Deployments.Queries.GetDeployments
{
    public class GetDeploymentsQuery : IRequest<PagedResult<DeploymentDto>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ProjectName { get; set; }
        public string? Environment { get; set; }
    }

    public class GetDeploymentsQueryHandler : IRequestHandler<GetDeploymentsQuery, PagedResult<DeploymentDto>>
    {
        private readonly IDeploymentService _deploymentService;

        public GetDeploymentsQueryHandler(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        public async Task<PagedResult<DeploymentDto>> Handle(GetDeploymentsQuery request, CancellationToken cancellationToken)
        {
            return await _deploymentService.GetDeploymentsAsync(request.Page, request.PageSize, request.ProjectName, request.Environment);
        }
    }
}
