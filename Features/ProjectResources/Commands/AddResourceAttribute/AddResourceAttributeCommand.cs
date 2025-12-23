using MediatR;
using IncidentDashboard.Data;
using IncidentDashboard.Models;

namespace IncidentDashboard.Features.ProjectResources.Commands.AddResourceAttribute
{
    public class AddResourceAttributeCommand : IRequest<ResourceAttribute>
    {
        public int ResourceId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class AddResourceAttributeCommandHandler : IRequestHandler<AddResourceAttributeCommand, ResourceAttribute>
    {
        private readonly AppDbContext _context;

        public AddResourceAttributeCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResourceAttribute> Handle(AddResourceAttributeCommand request, CancellationToken cancellationToken)
        {
            var attribute = new ResourceAttribute
            {
                ResourceId = request.ResourceId,
                Key = request.Key,
                Value = request.Value
            };

            _context.ResourceAttributes.Add(attribute);
            await _context.SaveChangesAsync(cancellationToken);

            return attribute;
        }
    }
}
