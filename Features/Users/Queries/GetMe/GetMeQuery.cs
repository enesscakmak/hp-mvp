using MediatR;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Users.Queries.GetMe
{
    public class GetMeQuery : IRequest<User>
    {
        public string Email { get; set; }
    }

    public class GetMeQueryHandler : IRequestHandler<GetMeQuery, User>
    {
        private readonly AppDbContext _context;

        public GetMeQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> Handle(GetMeQuery request, CancellationToken cancellationToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        }
    }
}
