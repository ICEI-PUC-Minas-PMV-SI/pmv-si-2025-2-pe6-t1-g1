using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api.Models;
using System.Security.Claims;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<Order>> CreateOrder()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var cartItems = await _context.UserCarts
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Item)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    return BadRequest(new { message = "Carrinho vazio" });
                }

                var order = new Order
                {
                    UserId = userId,
                    EnderecoEntregaId = 1, // Valor temporário - deveria vir do frontend
                    DataPedido = DateTime.Now,
                    Status = "PENDING",
                    Total = cartItems.Sum(c => c.Item.Value * c.Quantity)
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var cartItem in cartItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ItemId = cartItem.ItemId,
                        Quantity = cartItem.Quantity
                    };
                    _context.OrderItems.Add(orderItem);
                }

                _context.UserCarts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao criar pedido", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<object>> GetOrder(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var query = _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                    .Where(o => o.Id == id);

                if (userRole != "ADMIN" && userRole != "EMPLOYEE")
                {
                    query = query.Where(o => o.UserId == userId);
                }

                var order = await query.FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound(new { message = "Pedido não encontrado" });
                }

                var orderResponse = new
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    OrderDate = order.DataPedido,
                    Status = order.Status,
                    TotalAmount = order.Total,
                    Items = order.OrderItems.Select(oi => new
                    {
                        ItemId = oi.ItemId,
                        ItemName = oi.Item.NameItem,
                        Quantity = oi.Quantity,
                        ItemValue = oi.Item.Value,
                        Total = oi.Item.Value * oi.Quantity
                    })
                };

                return Ok(orderResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar pedido", error = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var query = _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Item).AsQueryable();

                if (userRole != "ADMIN" && userRole != "EMPLOYEE")
                {
                    query = query.Where(o => o.UserId == userId);
                }

                var orders = await query
                    .OrderByDescending(o => o.DataPedido)
                    .Select(o => new
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        OrderDate = o.DataPedido,
                        Status = o.Status,
                        TotalAmount = o.Total,
                        ItemCount = o.OrderItems.Count
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar pedidos", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "ADMIN,EMPLOYEE")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = "Pedido não encontrado" });
                }

                var validStatuses = new[] { "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED" };
                if (!validStatuses.Contains(status.ToUpper()))
                {
                    return BadRequest(new { message = "Status inválido" });
                }

                order.Status = status.ToUpper();
                await _context.SaveChangesAsync();

                return Ok(new { message = "Status do pedido atualizado com sucesso", status = order.Status });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao atualizar status do pedido", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { message = "Pedido não encontrado" });
                }

                _context.OrderItems.RemoveRange(order.OrderItems);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Pedido removido com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao remover pedido", error = ex.Message });
            }
        }
    }
}
