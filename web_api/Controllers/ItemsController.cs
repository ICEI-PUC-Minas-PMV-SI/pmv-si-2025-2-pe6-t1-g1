using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Item>> CreateItem(Item item)
        {
            try
            {
                _context.Items.Add(item);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao criar item", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            try
            {
                var items = await _context.Items.ToListAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar itens", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound(new { message = "Item não encontrado" });
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao buscar item", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateItem(int id, Item item)
        {
            if (id != item.Id)
            {
                return BadRequest(new { message = "ID do item não confere" });
            }

            try
            {
                var existingItem = await _context.Items.FindAsync(id);
                if (existingItem == null)
                {
                    return NotFound(new { message = "Item não encontrado" });
                }

                existingItem.NameItem = item.NameItem;
                existingItem.Description = item.Description;
                existingItem.Value = item.Value;
                existingItem.Category = item.Category;

                await _context.SaveChangesAsync();
                return Ok(existingItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao atualizar item", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound(new { message = "Item não encontrado" });
                }

                _context.Items.Remove(item);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Item removido com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao remover item", error = ex.Message });
            }
        }
    }
}
