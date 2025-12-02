using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IncidentDashboard.Data;
using IncidentDashboard.Models;
using System.Security.Claims;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Tags("07. Users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<ActionResult<object>> GetMe()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Select(u => new 
                { 
                    u.Id, 
                    u.Username, 
                    u.Email, 
                    u.Role 
                })
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new 
                { 
                    u.Id, 
                    u.Username, 
                    u.Email, 
                    u.Role 
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
