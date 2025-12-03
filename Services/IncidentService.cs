using IncidentDashboard.Data;
using IncidentDashboard.DTOs;
using IncidentDashboard.Models;
using IncidentDashboard.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IncidentDashboard.Services
{
    public class IncidentService : IIncidentService
    {
        private readonly AppDbContext _context;

        public IncidentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<IncidentDto>> GetIncidentsAsync(int page, int pageSize, int? deploymentId = null, int? projectId = null)
        {
            var query = _context.Incidents.AsQueryable();

            if (deploymentId.HasValue)
            {
                query = query.Where(i => i.DeploymentId == deploymentId.Value);
            }

            if (projectId.HasValue)
            {
                query = query.Where(i => i.ProjectId == projectId.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => MapToDto(i))
                .ToListAsync();

            return new PagedResult<IncidentDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<IncidentDto?> GetIncidentByIdAsync(int id)
        {
            var incident = await _context.Incidents.FindAsync(id);
            return incident == null ? null : MapToDto(incident);
        }

        public async Task<IncidentDto> CreateIncidentAsync(CreateIncidentDto incidentDto)
        {
            var incident = new Incident
            {
                Title = incidentDto.Title,
                Description = incidentDto.Description,
                Type = incidentDto.Type,
                Severity = incidentDto.Severity,
                AssignedTo = incidentDto.AssignedTo,
                DeploymentId = incidentDto.DeploymentId,
                ProjectId = incidentDto.ProjectId,
                Status = IncidentStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            _context.Incidents.Add(incident);
            await _context.SaveChangesAsync();

            return MapToDto(incident);
        }

        public async Task<bool> UpdateIncidentAsync(int id, UpdateIncidentDto incidentDto)
        {
            var incident = await _context.Incidents.FindAsync(id);
            if (incident == null) return false;

            if (incidentDto.Title != null) incident.Title = incidentDto.Title;
            if (incidentDto.Description != null) incident.Description = incidentDto.Description;
            if (incidentDto.Type.HasValue) incident.Type = incidentDto.Type.Value;
            if (incidentDto.Severity.HasValue) incident.Severity = incidentDto.Severity.Value;
            if (incidentDto.Status.HasValue) incident.Status = incidentDto.Status.Value;
            if (incidentDto.AssignedTo != null) incident.AssignedTo = incidentDto.AssignedTo;
            if (incidentDto.DeploymentId.HasValue) incident.DeploymentId = incidentDto.DeploymentId.Value;
            if (incidentDto.ProjectId.HasValue) incident.ProjectId = incidentDto.ProjectId.Value;

            if (incident.Status == IncidentStatus.Resolved && incident.ResolvedAt == null)
            {
                incident.ResolvedAt = DateTime.UtcNow;
            }
            else if (incident.Status != IncidentStatus.Resolved)
            {
                incident.ResolvedAt = null;
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncidentExists(id)) return false;
                throw;
            }
        }

        public async Task<bool> DeleteIncidentAsync(int id)
        {
            var incident = await _context.Incidents.FindAsync(id);
            if (incident == null) return false;

            _context.Incidents.Remove(incident);
            await _context.SaveChangesAsync();
            return true;
        }

        private bool IncidentExists(int id)
        {
            return _context.Incidents.Any(e => e.Id == id);
        }

        private static IncidentDto MapToDto(Incident incident)
        {
            return new IncidentDto
            {
                Id = incident.Id,
                Title = incident.Title,
                Description = incident.Description,
                Type = incident.Type,
                Severity = incident.Severity,
                Status = incident.Status,
                CreatedAt = incident.CreatedAt,
                ResolvedAt = incident.ResolvedAt,
                AssignedTo = incident.AssignedTo,
                DeploymentId = incident.DeploymentId,
                ProjectId = incident.ProjectId
            };
        }
    }
}
