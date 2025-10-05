using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace web_api.Controllers
{
    [Authorize]  // Exige autenticação para acessar os endpoints deste controlador
    // Define a rota base para o controlador e indica que é um controlador de API
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        // Contexto do banco de dados
        private readonly AppDbContext _context;

        // Construtor para injeção de dependência do contexto do banco de dados
        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        //Endpoints

        [AllowAnonymous]  // Permite acesso anônimo a este endpoint específico
        [HttpGet] // GET: api/Items - Busca todos os items
        public async Task<IActionResult> GetAll()
        {
            var model = await _context.Items.ToListAsync();
            return Ok(model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")] // PUT: api/Items/? - Atualiza um item existente
        public async Task<IActionResult> Update(int id, Item model)
        {
            if (id != model.Id) return BadRequest();

            var modeloDb = await _context.Items.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (modeloDb == null) return NotFound();

            _context.Items.Update(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost] // POST: api/Items - Cria um novo item
        public async Task<IActionResult> Create(Item model)
        {

            _context.Items.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetById", new { id = model.Id }, model);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")] // DELETE: api/Items/? - Deleta um item existente
        public async Task<IActionResult> Delete(int id)
        {
            var model = await _context.Items.FindAsync(id);

            if (model == null) return NotFound();

            _context.Items.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
