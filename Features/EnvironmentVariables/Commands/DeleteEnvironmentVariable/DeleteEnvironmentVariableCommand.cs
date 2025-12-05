using MediatR;
using IncidentDashboard.Data;

namespace IncidentDashboard.Features.EnvironmentVariables.Commands.DeleteEnvironmentVariable
{
    public class DeleteEnvironmentVariableCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public class DeleteEnvironmentVariableCommandHandler : IRequestHandler<DeleteEnvironmentVariableCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteEnvironmentVariableCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteEnvironmentVariableCommand request, CancellationToken cancellationToken)
        {
            var envVar = await _context.EnvironmentVariables.FindAsync(new object[] { request.Id }, cancellationToken);
            if (envVar == null)
            {
                return false;
            }

            _context.EnvironmentVariables.Remove(envVar);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
