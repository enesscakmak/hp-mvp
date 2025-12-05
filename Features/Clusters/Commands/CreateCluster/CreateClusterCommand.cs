using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.Clusters.Commands.CreateCluster
{
    public class CreateClusterCommand : IRequest<Cluster>
    {
        public string Name { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
    }

    public class CreateClusterCommandHandler : IRequestHandler<CreateClusterCommand, Cluster>
    {
        private readonly AppDbContext _context;

        public CreateClusterCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Cluster> Handle(CreateClusterCommand request, CancellationToken cancellationToken)
        {
            var cluster = new Cluster
            {
                Name = request.Name,
                Region = request.Region,
                Description = request.Description
            };

            _context.Clusters.Add(cluster);
            await _context.SaveChangesAsync(cancellationToken);

            return cluster;
        }
    }
}
