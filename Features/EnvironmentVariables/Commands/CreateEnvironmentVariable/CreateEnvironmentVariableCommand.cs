using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.EnvironmentVariables.Commands.CreateEnvironmentVariable
{
    public class CreateEnvironmentVariableCommand : IRequest<EnvironmentVariable>
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public int ProjectId { get; set; }
    }

    public class CreateEnvironmentVariableCommandHandler : IRequestHandler<CreateEnvironmentVariableCommand, EnvironmentVariable>
    {
        private readonly AppDbContext _context;

        public CreateEnvironmentVariableCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<EnvironmentVariable> Handle(CreateEnvironmentVariableCommand request, CancellationToken cancellationToken)
        {
            var envVar = new EnvironmentVariable
            {
                Key = request.Key,
                Value = request.Value,
                ProjectId = request.ProjectId
            };

            _context.EnvironmentVariables.Add(envVar);
            await _context.SaveChangesAsync(cancellationToken);

            return envVar;
        }
    }
}
