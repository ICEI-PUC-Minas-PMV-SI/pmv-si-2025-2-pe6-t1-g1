using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;
using System.Linq;
using System.Threading.Tasks;

// Define o controller e a rota base "api/cart"
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    // Acesso ao banco de dados
    private readonly AppDbContext _context;

    // Construtor para injeção de dependência do AppDbContext
    public CartController(AppDbContext context)
    {
        _context = context;
    }

    // Classes para receber os dados da requisição (DTOs)
    public class AddItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateItemDto
    {
        public int Quantity { get; set; }
    }


    // GET: /api/cart
    // Retorna os itens do carrinho do usuário.
    [HttpGet]
    public async Task<IActionResult> GetCartItems()
    {
        // TODO: Substituir '1' pelo ID do usuário autenticado
        var userId = 1; 

        var cartItems = await _context.UserCarts
            .Where(c => c.UserId == userId) // Filtra pelo usuário
            .Include(c => c.Item)           // Inclui dados do item (produto)
            .Select(c => new {
                CartItemId = c.Id,
                ItemId = c.ItemId,
                ItemName = c.Item.NameItem,
                Quantity = c.Quantity,
                Price = c.Item.Value,
                Subtotal = c.Quantity * c.Item.Value
            })
            .ToListAsync();

        var total = cartItems.Sum(item => item.Subtotal);

        return Ok(new { items = cartItems, total = total });
    }

    // POST: /api/cart
    // Adiciona um item ao carrinho.
    [HttpPost]
    public async Task<IActionResult> AddItemToCart([FromBody] AddItemDto itemDto)
    {
        // TODO: Substituir '1' pelo ID do usuário autenticado
        var userId = 1;

        // Validação básica
        var itemExists = await _context.Items.AnyAsync(i => i.Id == itemDto.ItemId);
        if (!itemExists)
        {
            return NotFound("Item não encontrado.");
        }

        // Procura o item no carrinho
        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ItemId == itemDto.ItemId);

        if (cartItem != null)
        {
            // Se já existe, soma a quantidade
            cartItem.Quantity += itemDto.Quantity;
        }
        else
        {
            // Se não existe, cria um novo registro
            cartItem = new UserCart
            {
                UserId = userId,
                ItemId = itemDto.ItemId,
                Quantity = itemDto.Quantity
            };
            await _context.UserCarts.AddAsync(cartItem);
        }

        await _context.SaveChangesAsync(); // Salva no banco

        return CreatedAtAction(nameof(GetCartItems), new { id = cartItem.Id }, cartItem);
    }

    // PUT: /api/cart/{cartItemId}
    // Atualiza a quantidade de um item.
    [HttpPut("{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateItemDto updateDto)
    {
        // TODO: Substituir '1' pelo ID do usuário autenticado
        var userId = 1;

        // Busca o item no carrinho, garantindo que pertence ao usuário
        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound("Item do carrinho não encontrado.");
        }

        cartItem.Quantity = updateDto.Quantity;
        await _context.SaveChangesAsync(); // Salva no banco

        return Ok(cartItem);
    }

    // DELETE: /api/cart/{cartItemId}
    // Remove um item do carrinho.
    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        // TODO: Substituir '1' pelo ID do usuário autenticado
        var userId = 1;
        
        // Busca o item no carrinho, garantindo que pertence ao usuário
        var cartItem = await _context.UserCarts
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return NotFound("Item do carrinho não encontrado.");
        }

        _context.UserCarts.Remove(cartItem);
        await _context.SaveChangesAsync(); // Salva no banco

        return NoContent(); // Retorna sucesso sem conteúdo
    }
}
