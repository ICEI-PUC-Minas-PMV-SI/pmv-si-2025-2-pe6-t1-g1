using mf_apis_web_services_fuel_manager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mf_apis_web_services_fuel_manager.Controllers
{
    [Authorize] // exige autenticação para todos os métodos
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // USER ENDPOINTS
        [Authorize(Roles = "Usuario")]
        [HttpPost("order")]
        public async Task<ActionResult> Create(Order model)
        {
            _context.Orders.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [Authorize(Roles = "Usuario")]
        [HttpGet("order/{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var model = await _context.Orders.FindAsync(id);

            if (model == null) return NotFound();

            return Ok(model);
        }

        [Authorize(Roles = "Usuario")]
        [HttpDelete("order/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var model = await _context.Orders.FindAsync(id);

            if (model == null) return NotFound();

            _context.Orders.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ADMIN/EMPLOYEE ENDPOINT
        [Authorize(Roles = "Administrador,Funcionario")]
        [HttpGet("orders")]
        public async Task<ActionResult> GetAll()
        {
            var orders = await _context.Orders.ToListAsync();
            return Ok(orders);
        }

        // ADMIN/EMPLOYEE/USERS ENDPOINT
        [Authorize(Roles = "Administrador,Funcionario,Usuario")]
        [HttpPatch("cancel/{id}")]
        public async Task<ActionResult> Cancel(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null) return NotFound();

            order.IsCanceled = true;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
