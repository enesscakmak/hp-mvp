using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IncidentDashboard.Features.Activity.Queries.GetActivityFeed;

namespace IncidentDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Tags("08. Activity")]
    public class ActivityController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivityController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("feed")]
        public async Task<ActionResult<IEnumerable<object>>> GetActivityFeed()
        {
            var activities = await _mediator.Send(new GetActivityFeedQuery());
            return Ok(activities);
        }
    }
}
