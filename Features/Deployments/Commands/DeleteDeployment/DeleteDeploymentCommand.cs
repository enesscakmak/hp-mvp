using MediatR;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Deployments.Commands.DeleteDeployment
{
    public class DeleteDeploymentCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteDeploymentCommandHandler : IRequestHandler<DeleteDeploymentCommand, bool>
    {
        private readonly IDeploymentService _deploymentService;

        public DeleteDeploymentCommandHandler(IDeploymentService deploymentService)
        {
            _deploymentService = deploymentService;
        }

        public async Task<bool> Handle(DeleteDeploymentCommand request, CancellationToken cancellationToken)
        {
            return await _deploymentService.DeleteDeploymentAsync(request.Id);
        }
    }
}
