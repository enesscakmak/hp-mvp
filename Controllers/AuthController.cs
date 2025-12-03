using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Models;
using IncidentDashboard.DTOs;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("06. Authentication")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto request)
        {
            try
            {
                var user = await _authService.RegisterAsync(request);
                return Ok(new UserDto 
                { 
                    Id = user.Id, 
                    Username = user.Username, 
                    Email = user.Email, 
                    Role = user.Role 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            var token = await _authService.LoginAsync(request);

            if (token == null)
            {
                return BadRequest("User not found or wrong password.");
            }

            return Ok(new { token });
        }
    }
}
