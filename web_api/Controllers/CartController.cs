using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api.Models;
using System.Security.Claims;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "USER")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("item")]
        public async Task<ActionResult<UserCart>> AddItemToCart(UserCart cartItem)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                // Verificar se o item existe
                var item = await _context.Items.FindAsync(cartItem.ItemId);
                if (item == null)
                {
                    return NotFound(new { message = "Item não encontrado" });
                }

                var userId = int.Parse(userIdClaim.Value);
                cartItem.UserId = userId;

                var existingCartItem = await _context.UserCarts
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.ItemId == cartItem.ItemId);

                if (existingCartItem != null)
                {
                    existingCartItem.Quantity += cartItem.Quantity;
                    await _context.SaveChangesAsync();
                    return Ok(existingCartItem);
                }

                _context.UserCarts.Add(cartItem);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCartItem), new { id = cartItem.Id }, cartItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao adicionar item ao carrinho", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUserCart()
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
                    .Select(c => new {
                        Id = c.Id,
                        ItemId = c.ItemId,
                        ItemName = c.Item.NameItem,
                        ItemPrice = c.Item.Value,
                        Quantity = c.Quantity,
                        TotalPrice = c.Item.Value * c.Quantity
                    })
                    .ToListAsync();

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar carrinho", error = ex.Message });
            }
        }

        [HttpGet("item/{id}")]
        public async Task<ActionResult<UserCart>> GetCartItem(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var cartItem = await _context.UserCarts
                    .Include(c => c.Item)
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound(new { message = "Item do carrinho não encontrado" });
                }

                return Ok(cartItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar item do carrinho", error = ex.Message });
            }
        }

        [HttpPut("item/{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartItemDto updateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var cartItem = await _context.UserCarts
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound(new { message = "Item do carrinho não encontrado" });
                }

                if (updateDto.quantity <= 0)
                {
                    return BadRequest(new { message = "Quantidade deve ser maior que zero" });
                }

                cartItem.Quantity = updateDto.quantity;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Item do carrinho atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao atualizar item do carrinho", error = ex.Message });
            }
        }

        [HttpDelete("item/{id}")]
        public async Task<IActionResult> RemoveCartItem(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var userId = int.Parse(userIdClaim.Value);

                var cartItem = await _context.UserCarts
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound(new { message = "Item do carrinho não encontrado" });
                }

                _context.UserCarts.Remove(cartItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Item removido do carrinho com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao remover item do carrinho", error = ex.Message });
            }
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
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
                    .ToListAsync();

                _context.UserCarts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return NoContent(); // Status 204
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao limpar carrinho", error = ex.Message });
            }
        }
    }
}
