using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.EnvironmentVariables.Commands.UpdateEnvironmentVariable
{
    public class UpdateEnvironmentVariableCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public int ProjectId { get; set; }
    }

    public class UpdateEnvironmentVariableCommandHandler : IRequestHandler<UpdateEnvironmentVariableCommand, bool>
    {
        private readonly AppDbContext _context;

        public UpdateEnvironmentVariableCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateEnvironmentVariableCommand request, CancellationToken cancellationToken)
        {
            var envVar = await _context.EnvironmentVariables.FindAsync(new object[] { request.Id }, cancellationToken);

            if (envVar == null)
            {
                return false;
            }

            envVar.Key = request.Key;
            envVar.Value = request.Value;
            envVar.ProjectId = request.ProjectId;

            _context.Entry(envVar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.EnvironmentVariables.Any(e => e.Id == request.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }
    }
}
