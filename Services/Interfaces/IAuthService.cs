using IncidentDashboard.DTOs;
using IncidentDashboard.Models;

namespace IncidentDashboard.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterDto request);
        Task<string?> LoginAsync(LoginDto request);
    }
}
