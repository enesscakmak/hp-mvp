using MediatR;
using IncidentDashboard.DTOs;
using IncidentDashboard.Models;
using IncidentDashboard.Services.Interfaces;

namespace IncidentDashboard.Features.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<User>
    {
        public RegisterDto RegisterDto { get; set; }

        public RegisterCommand(RegisterDto registerDto)
        {
            RegisterDto = registerDto;
        }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, User>
    {
        private readonly IAuthService _authService;

        public RegisterCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<User> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(request.RegisterDto);
        }
    }
}
