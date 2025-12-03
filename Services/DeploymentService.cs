using IncidentDashboard.Data;
using IncidentDashboard.DTOs;
using IncidentDashboard.Models;
using IncidentDashboard.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IncidentDashboard.Services
{
    public class DeploymentService : IDeploymentService
    {
        private readonly AppDbContext _context;

        public DeploymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DeploymentDto>> GetDeploymentsAsync(int page, int pageSize, string? projectName = null, string? environment = null)
        {
            var query = _context.Deployments.AsQueryable();

            if (!string.IsNullOrEmpty(projectName))
            {
                query = query.Where(d => d.ProjectName == projectName);
            }

            if (!string.IsNullOrEmpty(environment))
            {
                query = query.Where(d => d.Environment == environment);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(d => d.DeployedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => MapToDto(d))
                .ToListAsync();

            return new PagedResult<DeploymentDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<DeploymentDto?> GetDeploymentByIdAsync(int id)
        {
            var deployment = await _context.Deployments.FindAsync(id);
            return deployment == null ? null : MapToDto(deployment);
        }

        public async Task<DeploymentDto> CreateDeploymentAsync(CreateDeploymentDto deploymentDto)
        {
            var deployment = new Deployment
            {
                ProjectName = deploymentDto.ProjectName,
                Environment = deploymentDto.Environment,
                Version = deploymentDto.Version,
                CommitHash = deploymentDto.CommitHash,
                Author = deploymentDto.Author,
                Status = DeploymentStatus.Pending,
                DeployedAt = DateTime.UtcNow
            };

            _context.Deployments.Add(deployment);
            await _context.SaveChangesAsync();

            return MapToDto(deployment);
        }

        public async Task<bool> UpdateDeploymentAsync(int id, UpdateDeploymentDto deploymentDto)
        {
            var deployment = await _context.Deployments.FindAsync(id);
            if (deployment == null) return false;

            if (deploymentDto.Status.HasValue) deployment.Status = deploymentDto.Status.Value;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeploymentExists(id)) return false;
                throw;
            }
        }

        public async Task<bool> DeleteDeploymentAsync(int id)
        {
            var deployment = await _context.Deployments.FindAsync(id);
            if (deployment == null) return false;

            _context.Deployments.Remove(deployment);
            await _context.SaveChangesAsync();
            return true;
        }

        private bool DeploymentExists(int id)
        {
            return _context.Deployments.Any(e => e.Id == id);
        }

        private static DeploymentDto MapToDto(Deployment deployment)
        {
            return new DeploymentDto
            {
                Id = deployment.Id,
                ProjectName = deployment.ProjectName,
                Environment = deployment.Environment,
                Version = deployment.Version,
                Status = deployment.Status,
                DeployedAt = deployment.DeployedAt,
                CommitHash = deployment.CommitHash,
                Author = deployment.Author,
                // Duration parsing logic if needed, simplified for now
                Duration = TimeSpan.Zero 
            };
        }
    }
}
