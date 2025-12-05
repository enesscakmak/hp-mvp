using MediatR;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.DTOs;
using IncidentDashboard.Features.Auth.Commands.Register;
using IncidentDashboard.Features.Auth.Commands.Login;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("06. Authentication")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto request)
        {
            try
            {
                var user = await _mediator.Send(new RegisterCommand(request));
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
            var token = await _mediator.Send(new LoginCommand(request));

            if (token == null)
            {
                return BadRequest("User not found or wrong password.");
            }

            return Ok(new { token });
        }
    }
}
