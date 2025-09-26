using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api.Models;
using System.Linq;
using System.Threading.Tasks;


[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{

    private readonly AppDbContext _context;


    public CartController(AppDbContext context)
    {
        _context = context;
    }


    public class AddItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateItemDto
    {
        public int Quantity { get; set; }
    }



    [HttpGet]
    public async Task<IActionResult> GetCartItems()
    {

        var userId = 1; 

        var cartItems = await _context.UserCarts
            .Where(c => c.UserId == userId) 
            .Include(c => c.Item)           
            .Select(c => new {
                CartItemId = c.Id,
                ItemId = c.ItemId,
                ItemName = c.Item.Name,
                Quantity = c.Quantity,
                Price = c.Item.Value,
                Subtotal = c.Quantity * c.Item.Value
            })
            .ToListAsync();

        var total = cartItems.Sum(item => item.Subtotal);

        return Ok(new { items = cartItems, total = total });
    }


    [HttpPost]
    public async Task<IActionResult> AddItemToCart([FromBody] AddItemDto itemDto)
    {

        var userId = 1;


        var itemExists = await _context.Items.AnyAsync(i => i.Id == itemDto.ItemId);
        if (!itemExists)
        {
            return NotFound("Item não encontrado.");
        }


        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ItemId == itemDto.ItemId);

        if (cartItem != null)
        {

            cartItem.Quantity += itemDto.Quantity;
        }
        else
        {

            cartItem = new UserCart
            {
                UserId = userId,
                ItemId = itemDto.ItemId,
                Quantity = itemDto.Quantity
            };
            await _context.UserCarts.AddAsync(cartItem);
        }

        await _context.SaveChangesAsync(); 

        return CreatedAtAction(nameof(GetCartItems), new { id = cartItem.Id }, cartItem);
    }


    [HttpPut("{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateItemDto updateDto)
    {

        var userId = 1;


        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound("Item do carrinho não encontrado.");
        }

        cartItem.Quantity = updateDto.Quantity;
        await _context.SaveChangesAsync(); 

        return Ok(cartItem);
    }


    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {

        var userId = 1;
        

        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound("Item do carrinho não encontrado.");
        }

        _context.UserCarts.Remove(cartItem);
        await _context.SaveChangesAsync(); 

        return NoContent(); 
    }
}