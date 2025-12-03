using IncidentDashboard.DTOs;

namespace IncidentDashboard.Services.Interfaces
{
    public interface IIncidentService
    {
        Task<PagedResult<IncidentDto>> GetIncidentsAsync(int page, int pageSize, int? deploymentId = null, int? projectId = null);
        Task<IncidentDto?> GetIncidentByIdAsync(int id);
        Task<IncidentDto> CreateIncidentAsync(CreateIncidentDto incidentDto);
        Task<bool> UpdateIncidentAsync(int id, UpdateIncidentDto incidentDto);
        Task<bool> DeleteIncidentAsync(int id);
    }
}
