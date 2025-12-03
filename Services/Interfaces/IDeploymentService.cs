using IncidentDashboard.DTOs;

namespace IncidentDashboard.Services.Interfaces
{
    public interface IDeploymentService
    {
        Task<PagedResult<DeploymentDto>> GetDeploymentsAsync(int page, int pageSize, string? projectName = null, string? environment = null);
        Task<DeploymentDto?> GetDeploymentByIdAsync(int id);
        Task<DeploymentDto> CreateDeploymentAsync(CreateDeploymentDto deploymentDto);
        Task<bool> UpdateDeploymentAsync(int id, UpdateDeploymentDto deploymentDto);
        Task<bool> DeleteDeploymentAsync(int id);
    }
}
