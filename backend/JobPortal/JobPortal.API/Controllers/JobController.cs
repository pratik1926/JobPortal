using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController: ControllerBase
    {
        [HttpGet]
        public IActionResult GetJobs()
        {
            return Ok("Jobs endpoint working");
        }
    }
}
