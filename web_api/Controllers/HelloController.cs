using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public ActionResult<string> Get()
        {
            return Ok("Hello World from Pizzaria API!");
        }

        [HttpGet("welcome/{name}")]
        public ActionResult<string> Welcome(string name)
        {
            return Ok($"Welcome to our Pizzaria, {name}!");
        }

        [HttpGet("status")]
        public ActionResult<object> GetStatus()
        {
            return Ok(new
            {
                Message = "Pizzaria API is running!",
                Timestamp = DateTime.Now,
                Status = "Healthy"
            });
        }
    }
}