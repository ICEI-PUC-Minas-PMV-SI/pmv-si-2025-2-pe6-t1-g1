using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api.Models;
using web_api.Models.DTOs;
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

        // ALTERADO: Agora recebe a lista de itens via corpo da requisição (JSON)
        [HttpPost]
        [Authorize] 
        public async Task<ActionResult<object>> CreateOrder([FromBody] List<OrderRequestItem> items)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                // Valida se a lista enviada pelo front tem itens
                if (items == null || !items.Any())
                {
                    return BadRequest(new { message = "Carrinho vazio" });
                }

                // Calcula o total buscando os preços reais no banco de dados (segurança)
                decimal total = 0;
                var orderItemsToSave = new List<OrderItem>();

                foreach (var itemDto in items)
                {
                    var product = await _context.Items.FindAsync(itemDto.ItemId);
                    
                    // Se o item existir, adiciona ao cálculo
                    if (product != null)
                    {
                        total += product.Value * itemDto.Quantity;
                        orderItemsToSave.Add(new OrderItem
                        {
                            ItemId = itemDto.ItemId,
                            Quantity = itemDto.Quantity
                        });
                    }
                }

                var order = new Order
                {
                    UserId = userId,
                    EnderecoEntregaId = 1,
                    DataPedido = DateTime.Now,
                    Status = "PENDING",
                    Total = total
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Salva para gerar o ID do pedido

                // Vincula os itens ao pedido recém-criado
                foreach (var oi in orderItemsToSave)
                {
                    oi.OrderId = order.Id;
                    _context.OrderItems.Add(oi);
                }

                await _context.SaveChangesAsync();

                // Retorna objeto simples
                var simpleResponse = new 
                { 
                    Id = order.Id, 
                    Status = order.Status, 
                    Total = order.Total, 
                    DataPedido = order.DataPedido 
                };

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, simpleResponse);
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
        [Authorize] 
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Pedido não encontrado" });
            }

            var validStatuses = new[] { "PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED" };
            if (!validStatuses.Contains(request.Status.ToUpper()))
            {
                return BadRequest(new { message = "Status inválido" });
            }

            order.Status = request.Status.ToUpper();
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status do pedido atualizado com sucesso", status = order.Status });
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

    // DTO auxiliar para receber os itens do Frontend
    public class OrderRequestItem
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }
}